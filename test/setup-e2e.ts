import * as dotenv from "dotenv";

dotenv.config({ path: ".env", override: true });

dotenv.config({ path: ".env.test", override: true });

import { execSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import { PrismaClient } from "generated/prisma";
import Redis from "ioredis";
import { DomainEvents } from "@/core/events/domain-events";
import { envSchema } from "@/infra/env/env";

const prisma = new PrismaClient();

const env = envSchema.parse(process.env);

let redis: Redis;

function generateUniqueDatabaseURL(schemaId: string) {
	if (!env.DATABASE_URL) {
		throw new Error("Please provide a DATABASE_URL environment variable");
	}

	const url = new URL(env.DATABASE_URL);

	url.searchParams.set("schema", schemaId);
	url.searchParams.set("connect_timeout", "1000");

	return url.toString();
}

const schemaId = randomUUID();

beforeAll(async () => {
	const databaseUrl = generateUniqueDatabaseURL(schemaId);

	process.env.PRISMA_SCHEMA_DISABLE_ADVISORY_LOCK = "true";

	process.env.DATABASE_URL = databaseUrl;

	DomainEvents.shouldRun = false;

	execSync("pnpm prisma migrate deploy");

	redis = new Redis({
		host: env.REDIS_HOST,
		port: Number(env.REDIS_PORT) || 6379,
		db: Number(env.REDIS_DB) || 1,
		password: env.REDIS_PASSWORD,
	});
});

afterEach(async () => {
	if (redis) {
		await redis.flushdb();
	}
});

afterAll(async () => {
	await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schemaId}" CASCADE`);

	await prisma.$disconnect();

	if (redis) {
		await redis.flushdb();
		await redis.quit();
	}
});

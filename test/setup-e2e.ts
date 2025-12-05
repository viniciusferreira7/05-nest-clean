import * as dotenv from "dotenv";

dotenv.config({ path: ".env", override: true });

dotenv.config({ path: ".env.test", override: true });

import { execSync } from "node:child_process";
import { randomUUID } from "node:crypto";

import { DomainEvents } from "@/core/events/domain-events";
import { PrismaClient } from "generated/prisma";
import Redis from "ioredis";

const prisma = new PrismaClient();

let redis: Redis;

function generateUniqueDatabaseURL(schemaId: string) {
	if (!process.env.DATABASE_URL) {
		throw new Error("Please provide a DATABASE_URL environment variable");
	}

	const url = new URL(process.env.DATABASE_URL);

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
		host: process.env.REDIS_HOST,
		port: Number(process.env.REDIS_PORT) || 6379,
		db: Number(process.env.REDIS_DB) || 0,
		password: process.env.REDIS_PASSWORD,
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

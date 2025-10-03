import { type PrismaClient } from "generated/prisma";
import z from "zod";

function isUUID(str: string): boolean {
	const result = z.object({ str: z.string().uuid() }).safeParse({ str });

	return result.success;
}

export async function dropUUIDSchemas(prisma: PrismaClient) {
	const result = await prisma.$queryRawUnsafe<{ schema_name: string }[]>(
		`SELECT schema_name FROM information_schema.schemata`,
	);

	const IGNORED_SCHEMAS = ["pg_catalog", "information_schema", "public"];

	const uuidSchemas = result
		.map(({ schema_name }) => schema_name)
		.filter((name) => isUUID(name) && !IGNORED_SCHEMAS.includes(name));

	for (const schema of uuidSchemas) {
		console.log(`Dropping schema: ${schema}`);
		await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schema}" CASCADE`);
	}

	const userSchemas = await prisma.$queryRawUnsafe<{ schema_name: string }[]>(
		`SELECT schema_name
   FROM information_schema.schemata
   WHERE schema_name NOT IN ('pg_catalog', 'information_schema')`,
	);

	console.log({ userSchemas });

	await prisma.$disconnect();
}

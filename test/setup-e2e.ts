import 'dotenv/config'

import { randomUUID } from 'node:crypto'

import { execSync } from 'child_process'
import { PrismaClient } from 'generated/prisma'

const prisma = new PrismaClient()

function generateUniqueDatabaseURL(schemaId: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error('Please provide a DATABASE_URL environment variable')
  }

  // const url = new URL(process.env.DATABASE_URL)
  const url = new URL("postgresql://docker:docker@localhost:5432/05nestclean?schema=public")

  url.searchParams.set('schema', schemaId)
  url.searchParams.set('connect_timeout', '100')

  return url.toString()
}

const schemaId = randomUUID()

beforeAll(async () => {
  const databaseUrl = generateUniqueDatabaseURL(schemaId)

  process.env.DATABASE_URL = databaseUrl

  console.log({ databaseUrl })

  execSync('pnpm prisma migrate deploy')
})

afterAll(async () => {
  await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schemaId} CASCADE"`)
  await prisma.$disconnect()
})

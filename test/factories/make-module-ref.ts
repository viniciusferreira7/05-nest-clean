import 'dotenv/config'

import { Test, TestingModule } from '@nestjs/testing'
import { PrismaClient } from 'generated/prisma'

import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

export async function makeModuleRef(): Promise<TestingModule> {
  const databaseUrl = process.env.DATABASE_URL
  const moduleRef = await Test.createTestingModule({
    imports: [AppModule],
  })
    .overrideProvider(PrismaService)
    .useFactory({
      factory() {
        return new PrismaClient({
          datasources: {
            db: {
              url: databaseUrl,
            },
          },
        })
      },
    })
    .compile()

  return moduleRef
}

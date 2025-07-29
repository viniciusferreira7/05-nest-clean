import 'dotenv/config'

import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { PrismaClient } from 'generated/prisma'
import request from 'supertest'

import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

describe('Create account (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService

  beforeAll(async () => {
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

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)

    await app.init()
  })

  test('[POST]: /accounts', async () => {
    const response = await request(app.getHttpServer()).post('/accounts').send({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: '123456',
    })

    expect(response.statusCode).toBe(201)

    const userOnDatabase = await prisma.user.findUnique({
      where: {
        email: 'john.doe@example.com',
      },
    })

    expect(userOnDatabase).toEqual(
      expect.objectContaining({
        name: 'John Doe',
        email: 'john.doe@example.com',
      }),
    )
  })

  afterAll(async () => {
    await app.close()
  })
})

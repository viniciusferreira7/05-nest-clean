import { INestApplication } from '@nestjs/common'
import request from 'supertest'
import { makeModuleRef } from 'test/factories/make-module-ref'

import { PrismaService } from '@/infra/database/prisma/prisma.service'

describe('Create question (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService

  beforeAll(async () => {
    const moduleRef = await makeModuleRef()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)

    await app.init()
  })

  test('[POST]: /questions', async () => {
    await request(app.getHttpServer()).post('/accounts').send({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: '123456',
    })

    const {
      body: { access_token: accessToken },
    } = await request(app.getHttpServer()).post('/sessions').send({
      email: 'john.doe@example.com',
      password: '123456',
    })

    const response = await request(app.getHttpServer())
      .post('/questions')
      .send({
        title: 'New question',
        content: 'Question content',
      })
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(201)

    const questionOnDatabase = await prisma.question.findFirst({
      where: {
        title: 'New question',
      },
    })

    expect(questionOnDatabase).toEqual(
      expect.objectContaining({
        title: 'New question',
        content: 'Question content',
      }),
    )
  })

  afterAll(async () => {
    await app.close()
  })
})

import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'

import { AppModule } from '@/app.module'
import { PrismaService } from '@/prisma/prisma.service'

describe('Create question (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

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
        title: 'New qeustion',
        content: 'Question content',
      })
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(201)

    const questionOnDatabase = await prisma.question.findFirst({
      where: {
        title: 'New qeustion',
      },
    })

    expect(questionOnDatabase).toEqual(
      expect.objectContaining({
        title: 'New qeustion',
        content: 'Question content',
      }),
    )
  })

  afterAll(async () => {
    await app.close()
  })
})

import 'dotenv/config'

import { INestApplication } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Test } from '@nestjs/testing'
import request from 'supertest'

import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { Env } from '@/infra/env'

describe('Create question (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let config: ConfigService<Env, true>

  beforeAll(async () => {
    console.log(process.env.DATABASE_URL, 'antes')
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    // TODO: Error here

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    config = moduleRef.get(ConfigService)

    console.log(config.get('DATABASE_URL'), 'test')
    console.log(process.env.DATABASE_URL, 'depois')

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

    // console.log({ accessToken })

    const response = await request(app.getHttpServer())
      .post('/questions')
      .send({
        title: 'New question',
        content: 'Question content',
      })
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(201)

    // console.log({ response: response.body })

    const questionOnDatabase = await prisma.question.findFirst({
      where: {
        title: 'New question',
      },
    })

    // console.log(await prisma.question.findMany())

    // console.log({ questionOnDatabase })
    console.log(process.env.DATABASE_URL)

    // expect(questionOnDatabase).toEqual(
    //   expect.objectContaining({
    //     title: 'New question',
    //     content: 'Question content',
    //   }),
    // )
  })

  afterAll(async () => {
    await app.close()
  })
})

// TODO: Ajustar os testes E2E

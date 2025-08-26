import { INestApplication } from '@nestjs/common'
import { hash } from 'bcryptjs'
import request from 'supertest'
import { makeModuleRef } from 'test/factories/make-module-ref'
import { StudentFactory } from 'test/factories/make-student'

describe('Authenticate (E2E)', () => {
  let app: INestApplication
  let studentFactory: StudentFactory

  beforeAll(async () => {
    const moduleRef = await makeModuleRef()

    app = moduleRef.createNestApplication()
    studentFactory = moduleRef.get(StudentFactory)

    await app.init()
  })

  test('[POST]: /sessions', async () => {
    const user = await studentFactory.makePrismaStudent({
      email: 'john.doe@example.com',
      password: await hash('123456', 8)
    })

    const response = await request(app.getHttpServer()).post('/sessions').send({
      email: user?.email,
      password: '123456',
    })

    expect(response.statusCode).toBe(201)

    expect(response.body).toEqual(
      expect.objectContaining({
        access_token: expect.any(String),
      }),
    )
  })

  afterAll(async () => {
    await app.close()
  })
})

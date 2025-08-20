import { INestApplication } from '@nestjs/common'
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
    const user = await studentFactory.makePrismaStudent()

    const response = await request(app.getHttpServer()).post('/sessions').send({
      email: user?.email,
      password: user?.password,
    })

    expect(response.statusCode).toBe(201)

    // FIXME: AssertionError: expected 401 to be 201 // Object.is equality
    console.log(response.body)

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

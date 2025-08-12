import { INestApplication } from '@nestjs/common'
import request from 'supertest'
import { makeModuleRef } from 'test/factories/make-module-ref'

describe('Authenticate (E2E)', () => {
  let app: INestApplication

  beforeAll(async () => {
    const moduleRef = await makeModuleRef()

    app = moduleRef.createNestApplication()

    await app.init()
  })

  test('[POST]: /sessions', async () => {
    await request(app.getHttpServer()).post('/accounts').send({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: '123456',
    })

    const response = await request(app.getHttpServer()).post('/sessions').send({
      email: 'john.doe@example.com',
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

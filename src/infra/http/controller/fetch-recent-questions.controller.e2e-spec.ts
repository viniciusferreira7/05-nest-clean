import { INestApplication } from '@nestjs/common'
import request from 'supertest'
import { makeModuleRef } from 'test/factories/make-module-ref'

describe('Fetch recent questions (E2E)', () => {
  let app: INestApplication

  beforeAll(async () => {
    app = (await makeModuleRef()).createNestApplication()

    await app.init()
  })

  test('[GET]: /questions', async () => {
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

    const questions = [
      {
        title: 'New question 1',
        content: 'Question content 1',
      },
      {
        title: 'New question 2',
        content: 'Question content 2',
      },
      {
        title: 'New question 3',
        content: 'Question content 3',
      },
    ]

    await Promise.all(
      questions.map((question) =>
        request(app.getHttpServer())
          .post('/questions')
          .send(question)
          .set('Authorization', `Bearer ${accessToken}`),
      ),
    )

    const response = await request(app.getHttpServer())
      .get('/questions?page=1')
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(200)

    expect(response.body).toEqual({
      questions: [
        expect.objectContaining({ title: 'New question 3' }),
        expect.objectContaining({ title: 'New question 2' }),
        expect.objectContaining({ title: 'New question 1' }),
      ],
    })

    expect(response.body.questions).toHaveLength(3)
  })

  afterAll(async () => {
    await app.close()
  })
})

import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import request from 'supertest'
import { makeModuleRef } from 'test/factories/make-module-ref'
import { StudentFactory } from 'test/factories/make-student'

describe('Get question by slug (E2E)', () => {
  let app: INestApplication
  let jwt: JwtService
  let studentFactory: StudentFactory

  beforeAll(async () => {
    const moduleRef = await makeModuleRef()

    app = moduleRef.createNestApplication()
    studentFactory = moduleRef.get(StudentFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[GET]: /questions/:slug', async () => {
    const user = await studentFactory.makePrismaStudent()

    const accessToken = jwt.sign({ sub: user.id.toString() })

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
      .get('/questions/new-question-3')
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(200)

    expect(response.body).toEqual({
      question: expect.objectContaining({
        title: 'New question 3',
        slug: 'new-question-3',
      }),
    })
  })

  afterAll(async () => {
    await app.close()
  })
})

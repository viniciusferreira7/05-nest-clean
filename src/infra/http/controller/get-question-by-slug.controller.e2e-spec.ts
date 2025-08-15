import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import request from 'supertest'
import { makeModuleRef } from 'test/factories/make-module-ref'
import { QuestionFactory } from 'test/factories/make-question'
import { StudentFactory } from 'test/factories/make-student'

describe('Get question by slug (E2E)', () => {
  let app: INestApplication
  let jwt: JwtService
  let studentFactory: StudentFactory
  let questionFactory: QuestionFactory

  beforeAll(async () => {
    const moduleRef = await makeModuleRef()

    app = moduleRef.createNestApplication()
    studentFactory = moduleRef.get(StudentFactory)
    jwt = moduleRef.get(JwtService)
    questionFactory = moduleRef.get(QuestionFactory)

    await app.init()
  })

  test('[GET]: /questions/:slug', async () => {
    const user = await studentFactory.makePrismaStudent()

    const accessToken = jwt.sign({ sub: user.id.toString() })

    await Promise.all([
      questionFactory.makePrismaQuestion({ authorId: user?.id }),
      questionFactory.makePrismaQuestion({ authorId: user?.id }),
      questionFactory.makePrismaQuestion({
        title: 'New question 3',
        authorId: user?.id,
      }),
    ])

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

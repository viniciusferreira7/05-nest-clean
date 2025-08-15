import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import request from 'supertest'
import { makeModuleRef } from 'test/factories/make-module-ref'
import { QuestionFactory } from 'test/factories/make-question'
import { StudentFactory } from 'test/factories/make-student'

describe('Fetch recent questions (E2E)', () => {
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

  test('[GET]: /questions', async () => {
    const user = await studentFactory.makePrismaStudent()

    const accessToken = jwt.sign({ sub: user.id.toString() })

    await Promise.all([
      questionFactory.makePrismaQuestion({
        title: 'New question 1',
        authorId: user?.id,
      }),
      questionFactory.makePrismaQuestion({
        title: 'New question 2',
        authorId: user?.id,
      }),
      questionFactory.makePrismaQuestion({
        title: 'New question 3',
        authorId: user?.id,
      }),
    ])

    const response = await request(app.getHttpServer())
      .get('/questions?page=1')
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(200)

    expect(response.body).toEqual({
      questions: [
        expect.objectContaining({
          title: 'New question 3',
          slug: 'new-question-3',
        }),
        expect.objectContaining({
          title: 'New question 2',
          slug: 'new-question-2',
        }),
        expect.objectContaining({
          title: 'New question 1',
          slug: 'new-question-1',
        }),
      ],
    })

    expect(response.body.questions).toHaveLength(3)
  })

  afterAll(async () => {
    await app.close()
  })
})

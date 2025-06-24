import { makeQuestion } from 'test/factories/make-question'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'

import { FetchRecentQuestionUseCase } from './fetch-recent-questions'

let inMemoryQuestionRepository: InMemoryQuestionsRepository
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository

let sut: FetchRecentQuestionUseCase

describe('Fetch Recent question', () => {
  beforeEach(async () => {
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository()
    inMemoryQuestionRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
    )
    sut = new FetchRecentQuestionUseCase(inMemoryQuestionRepository)
  })

  it('should be able to fetch recent questions', async () => {
    await inMemoryQuestionRepository.create(
      makeQuestion({
        createdAt: new Date(2000, 0, 22),
      }),
    )
    await inMemoryQuestionRepository.create(
      makeQuestion({
        createdAt: new Date(2000, 0, 18),
      }),
    )
    await inMemoryQuestionRepository.create(
      makeQuestion({
        createdAt: new Date(2000, 0, 15),
      }),
    )

    const result = await sut.execute({
      page: 1,
    })

    expect(result.isRight()).toBeTruthy()
    expect(result.value?.questions).toEqual([
      expect.objectContaining({
        createdAt: new Date(2000, 0, 22),
      }),
      expect.objectContaining({
        createdAt: new Date(2000, 0, 18),
      }),
      expect.objectContaining({
        createdAt: new Date(2000, 0, 15),
      }),
    ])
  })

  it('should be able to fetch paginated recent questions', async () => {
    for (let i = 0; i < 22; i++) {
      await inMemoryQuestionRepository.create(
        makeQuestion({
          createdAt: new Date(2000, 0, 22 + i),
        }),
      )
    }

    const result = await sut.execute({
      page: 2,
    })

    expect(result.isRight()).toBeTruthy()
    expect(result.value?.questions).toHaveLength(2)
    expect(result.value?.questions).toEqual([
      expect.objectContaining({
        createdAt: new Date(2000, 0, 23),
      }),
      expect.objectContaining({
        createdAt: new Date(2000, 0, 22),
      }),
    ])
  })
})

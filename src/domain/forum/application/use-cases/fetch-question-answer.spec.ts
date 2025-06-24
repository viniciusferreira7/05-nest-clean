import { makeAnswer } from 'test/factories/make-answer'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { expect } from 'vitest'

import { UniqueEntityId } from '@/core/entities/value-object/unique-entity-id'

import { FetchQuestionAnswerUseCase } from './fetch-question-answer'

let inMemoryAnswerRepository: InMemoryAnswersRepository
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository

let sut: FetchQuestionAnswerUseCase

describe('Fetch question answers', () => {
  beforeEach(async () => {
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository()
    inMemoryAnswerRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository,
    )
    sut = new FetchQuestionAnswerUseCase(inMemoryAnswerRepository)
  })

  it('should be able to fetch question answers', async () => {
    const questionId = new UniqueEntityId('question-1')

    await inMemoryAnswerRepository.create(
      makeAnswer({
        questionId,
      }),
    )
    await inMemoryAnswerRepository.create(
      makeAnswer({
        questionId,
      }),
    )
    await inMemoryAnswerRepository.create(
      makeAnswer({
        questionId,
      }),
    )

    const result = await sut.execute({
      questionId: questionId.toString(),
      page: 1,
    })

    expect(result.isRight()).toBeTruthy()
    expect(result.value?.answers).toHaveLength(3)
    expect(
      result.value?.answers.every((item) => item.questionId === questionId),
    ).toBeTruthy()
  })

  it('should be able to fetch paginated question answers', async () => {
    const questionId = new UniqueEntityId('question-1')

    for (let i = 0; i < 22; i++) {
      await inMemoryAnswerRepository.create(
        makeAnswer({
          questionId,
        }),
      )
    }

    const result = await sut.execute({
      questionId: questionId.toString(),
      page: 2,
    })

    expect(result.isRight()).toBeTruthy()
    expect(result.value?.answers).toHaveLength(2)
    expect(
      result.value?.answers.every((item) => item.questionId === questionId),
    ).toBeTruthy()
  })
})

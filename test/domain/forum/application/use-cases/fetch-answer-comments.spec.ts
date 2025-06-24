import { makeAnswerComment } from 'test/factories/make-answer-comment'
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository'
import { expect } from 'vitest'

import { UniqueEntityId } from '@/core/entities/value-object/unique-entity-id'

import { FetchAnswerCommentsUseCase } from './fetch-answer-comments'

let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository
let sut: FetchAnswerCommentsUseCase

describe('Fetch answer comments', () => {
  beforeEach(async () => {
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository()
    sut = new FetchAnswerCommentsUseCase(inMemoryAnswerCommentsRepository)
  })

  it('should be able to fetch answer comments', async () => {
    const answerId = new UniqueEntityId('answer-1')

    await inMemoryAnswerCommentsRepository.create(
      makeAnswerComment({
        answerId,
      }),
    )
    await inMemoryAnswerCommentsRepository.create(
      makeAnswerComment({
        answerId,
      }),
    )
    await inMemoryAnswerCommentsRepository.create(
      makeAnswerComment({
        answerId,
      }),
    )

    const result = await sut.execute({
      answerId: answerId.toString(),
      page: 1,
    })

    expect(result.isRight()).toBeTruthy()
    expect(result.value?.answerComments).toHaveLength(3)
    expect(
      result.value?.answerComments.every((item) => item.answerId === answerId),
    ).toBeTruthy()
  })

  it('should be able to fetch paginated answer comments', async () => {
    const answerId = new UniqueEntityId('answer-1')

    for (let i = 0; i < 22; i++) {
      await inMemoryAnswerCommentsRepository.create(
        makeAnswerComment({
          answerId,
        }),
      )
    }

    const result = await sut.execute({
      answerId: answerId.toString(),
      page: 2,
    })

    expect(result.isRight()).toBeTruthy()
    expect(result.value?.answerComments).toHaveLength(2)
    expect(
      result.value?.answerComments.every((item) => item.answerId === answerId),
    ).toBeTruthy()
  })
})

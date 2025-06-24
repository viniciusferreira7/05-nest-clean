import { makeQuestionComment } from 'test/factories/make-question-comment'
import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repository'
import { expect } from 'vitest'

import { UniqueEntityId } from '@/core/entities/value-object/unique-entity-id'

import { FetchQuestionCommentsUseCase } from './fetch-question-comments'

let inMemoryQuestionCommentRepository: InMemoryQuestionCommentsRepository
let sut: FetchQuestionCommentsUseCase

describe('Fetch question comments', () => {
  beforeEach(async () => {
    inMemoryQuestionCommentRepository = new InMemoryQuestionCommentsRepository()
    sut = new FetchQuestionCommentsUseCase(inMemoryQuestionCommentRepository)
  })

  it('should be able to fetch question comments', async () => {
    const questionId = new UniqueEntityId('question-1')

    await inMemoryQuestionCommentRepository.create(
      makeQuestionComment({
        questionId,
      }),
    )
    await inMemoryQuestionCommentRepository.create(
      makeQuestionComment({
        questionId,
      }),
    )
    await inMemoryQuestionCommentRepository.create(
      makeQuestionComment({
        questionId,
      }),
    )

    const result = await sut.execute({
      questionId: questionId.toString(),
      page: 1,
    })

    expect(result.isRight()).toBeTruthy()
    expect(result.value?.questionComments).toHaveLength(3)
    expect(
      result.value?.questionComments.every(
        (item) => item.questionId === questionId,
      ),
    ).toBeTruthy()
  })

  it('should be able to fetch paginated question comments', async () => {
    const questionId = new UniqueEntityId('question-1')

    for (let i = 0; i < 22; i++) {
      await inMemoryQuestionCommentRepository.create(
        makeQuestionComment({
          questionId,
        }),
      )
    }

    const result = await sut.execute({
      questionId: questionId.toString(),
      page: 2,
    })

    expect(result.isRight()).toBeTruthy()
    expect(result.value?.questionComments).toHaveLength(2)
    expect(
      result.value?.questionComments.every(
        (item) => item.questionId === questionId,
      ),
    ).toBeTruthy()
  })
})

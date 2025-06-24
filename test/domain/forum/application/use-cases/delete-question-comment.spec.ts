import { makeQuestionComment } from 'test/factories/make-question-comment'
import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repository'

import { UniqueEntityId } from '@/core/entities/value-object/unique-entity-id'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

import { DeleteQuestionCommentUseCase } from './delete-question-comment'

let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository
let sut: DeleteQuestionCommentUseCase

describe('Delete question comment', () => {
  beforeEach(() => {
    inMemoryQuestionCommentsRepository =
      new InMemoryQuestionCommentsRepository()
    sut = new DeleteQuestionCommentUseCase(inMemoryQuestionCommentsRepository)
  })

  it('should be able to delete question comment', async () => {
    const authorId = new UniqueEntityId()
    const questionCommentId = 'question-comment-1'

    const newQuestion = makeQuestionComment(
      {
        authorId,
      },
      new UniqueEntityId(questionCommentId),
    )

    await inMemoryQuestionCommentsRepository.create(newQuestion)

    const result = await sut.execute({
      authorId: authorId.toString(),
      questionCommentId,
    })

    expect(result.isRight()).toBeTruthy()
    expect(
      inMemoryQuestionCommentsRepository.items.every(
        (item) => item.id.toString() !== questionCommentId,
      ),
    ).toBeTruthy()

    expect(inMemoryQuestionCommentsRepository.items).toHaveLength(0)
  })

  it('should not be able to delete question comment with wrong id', async () => {
    const result = await sut.execute({
      authorId: new UniqueEntityId().toString(),
      questionCommentId: 'non-id-question-comment',
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to delete question comment where user is not creator of question`', async () => {
    const questionCommentId = 'question-comment-1'

    const newQuestionComment = makeQuestionComment(
      {
        authorId: new UniqueEntityId('author-1'),
      },
      new UniqueEntityId(questionCommentId),
    )

    await inMemoryQuestionCommentsRepository.create(newQuestionComment)

    const result = await sut.execute({
      authorId: 'author-2',
      questionCommentId,
    })

    expect(result.isLeft()).toBeTruthy()

    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})

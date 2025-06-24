import { makeAnswer } from 'test/factories/make-answer'
import { makeAnswerAttachment } from 'test/factories/make-answer-attachment'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'

import { UniqueEntityId } from '@/core/entities/value-object/unique-entity-id'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

import { EditAnswerUseCase } from './edit-answer'

let inMemoryAnswerRepository: InMemoryAnswersRepository
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let sut: EditAnswerUseCase

describe('Edit answer', () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository()
    inMemoryAnswerRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository,
    )
    sut = new EditAnswerUseCase(
      inMemoryAnswerRepository,
      inMemoryAnswerAttachmentsRepository,
    )
  })

  it('should be able to edit a answer', async () => {
    const authorId = new UniqueEntityId()
    const answerId = 'answer-1'

    const newAnswer = makeAnswer(
      {
        authorId,
      },
      new UniqueEntityId(answerId),
    )

    inMemoryAnswerAttachmentsRepository.items.push(
      makeAnswerAttachment({
        attachmentId: new UniqueEntityId('1'),
        answerId: newAnswer.id,
      }),
      makeAnswerAttachment({
        attachmentId: new UniqueEntityId('2'),
        answerId: newAnswer.id,
      }),
    )

    await inMemoryAnswerRepository.create(newAnswer)

    const result = await sut.execute({
      authorId: authorId.toString(),
      answerId,
      content: 'Edited content',
      attachmentsIds: ['1', '3'],
    })

    expect(result.isRight()).toBeTruthy()
    expect(
      inMemoryAnswerRepository.items.some((item) => {
        const isSameAuthorId = item.authorId === authorId
        const isSameAnswerId = item.id.toString() === answerId
        const isSameContentId = item.content === 'Edited content'

        return isSameAuthorId && isSameAnswerId && isSameContentId
      }),
    ).toBeTruthy()

    expect(inMemoryAnswerRepository.items[0]).toMatchObject({
      content: 'Edited content',
    })
  })

  it('should not be able to edit answer with wrong id', async () => {
    const result = await sut.execute({
      authorId: new UniqueEntityId().toString(),
      answerId: 'non-id-answer',
      content: 'Edited content',
      attachmentsIds: [],
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to edit answer where user is not creator of answer`', async () => {
    const answerId = 'answer-1'

    const newAnswer = makeAnswer(
      {
        authorId: new UniqueEntityId('author-1'),
      },
      new UniqueEntityId(answerId),
    )

    await inMemoryAnswerRepository.create(newAnswer)

    const result = await sut.execute({
      authorId: 'author-2',
      answerId,
      content: 'Edited content',
      attachmentsIds: [],
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})

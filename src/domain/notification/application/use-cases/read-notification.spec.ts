import { makeNotification } from 'test/factories/make-notification'
import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository'

import { UniqueEntityId } from '@/core/entities/value-object/unique-entity-id'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

import { ReadNotificationUseCase } from './read-notification'

let inMemoryNotificationRepository: InMemoryNotificationsRepository
let sut: ReadNotificationUseCase

describe('Read notification', () => {
  beforeEach(() => {
    inMemoryNotificationRepository = new InMemoryNotificationsRepository()
    sut = new ReadNotificationUseCase(inMemoryNotificationRepository)
  })

  it('should be able to read notification', async () => {
    const recipientId = new UniqueEntityId()
    const notificationId = 'notification-1'

    const newNotification = makeNotification(
      {
        recipientId,
      },
      new UniqueEntityId(notificationId),
    )

    await inMemoryNotificationRepository.create(newNotification)

    const result = await sut.execute({
      recipientId: recipientId.toString(),
      notificationId,
    })

    expect(result.isRight()).toBeTruthy()
    expect(
      inMemoryNotificationRepository.items.find(
        (item) => item.id.toString() === notificationId && !!item.readAt,
      ),
    ).toBeTruthy()
    expect(inMemoryNotificationRepository.items).toHaveLength(1)
  })

  it('should not be able to read notification with wrong id', async () => {
    const result = await sut.execute({
      recipientId: new UniqueEntityId().toString(),
      notificationId: 'non-id-notification',
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to read notification where user is not recipient of notification`', async () => {
    const notificationId = 'notification-1'

    const newNotification = makeNotification(
      {
        recipientId: new UniqueEntityId('recipient-1'),
      },
      new UniqueEntityId(notificationId),
    )

    await inMemoryNotificationRepository.create(newNotification)

    const result = await sut.execute({
      recipientId: 'recipient-2',
      notificationId,
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})

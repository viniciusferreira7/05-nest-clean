import { DomainEvents } from '@/core/events/domain-events'
import type { EventHandler } from '@/core/events/event-handler'
import type { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository'
import { AnswerCommentCreatedEvent } from '@/domain/forum/enterprise/events/answer-comment-created-event'

import type { SendNotificationUseCase } from '../application/use-cases/send-notification'

export class OnAnswerCommentCreated implements EventHandler {
  constructor(
    private answersRepository: AnswersRepository,
    private sendNotificationUseCase: SendNotificationUseCase,
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendNewAnswerCommentNotification.bind(this),
      AnswerCommentCreatedEvent.name,
    )
  }

  private async sendNewAnswerCommentNotification({
    answerComment,
    answerId,
  }: AnswerCommentCreatedEvent) {
    const answer = await this.answersRepository.findById(answerId.toString())

    if (!answer) return

    await this.sendNotificationUseCase.execute({
      recipientId: answer?.authorId.toString(),
      title: 'New comment in your answer',
      content: `Comment is ${answerComment.content
        .substring(0, 30)
        .concat('...')}`,
    })
  }
}

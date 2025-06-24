import { DomainEvents } from '@/core/events/domain-events'
import type { EventHandler } from '@/core/events/event-handler'
import type { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'
import { QuestionCommentCreatedEvent } from '@/domain/forum/enterprise/events/question-comment-created-event'

import type { SendNotificationUseCase } from '../application/use-cases/send-notification'

export class OnQuestionCommentCreated implements EventHandler {
  constructor(
    private questionsRepository: QuestionsRepository,
    private sendNotificationUseCase: SendNotificationUseCase,
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendNewQuestionCommentNotification.bind(this),
      QuestionCommentCreatedEvent.name,
    )
  }

  private async sendNewQuestionCommentNotification({
    questionComment,
    questionId,
  }: QuestionCommentCreatedEvent) {
    const question = await this.questionsRepository.findById(
      questionId.toString(),
    )

    if (!question) return

    await this.sendNotificationUseCase.execute({
      recipientId: question?.authorId.toString(),
      title: 'New comment in your question',
      content: `Comment is ${questionComment.content
        .substring(0, 30)
        .concat('...')}`,
    })
  }
}

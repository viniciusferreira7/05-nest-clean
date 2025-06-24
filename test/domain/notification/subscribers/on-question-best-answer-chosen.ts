import { DomainEvents } from '@/core/events/domain-events'
import type { EventHandler } from '@/core/events/event-handler'
import type { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository'
import { QuestionBestQuestionChosenEvent } from '@/domain/forum/enterprise/events/question-best-answer-chosen-event'

import type { SendNotificationUseCase } from '../application/use-cases/send-notification'

export class OnQuestionBestAnswerChosenCreated implements EventHandler {
  constructor(
    private answersRepository: AnswersRepository,
    private sendNotificationUseCase: SendNotificationUseCase,
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendQuestionBestAnswerNotification.bind(this),
      QuestionBestQuestionChosenEvent.name,
    )
  }

  private async sendQuestionBestAnswerNotification({
    bestAnswerId,
    question,
  }: QuestionBestQuestionChosenEvent) {
    const answer = await this.answersRepository.findById(
      bestAnswerId.toString(),
    )

    if (!answer) return

    await this.sendNotificationUseCase.execute({
      recipientId: answer?.authorId.toString(),
      title: `Your answer was chosen as best answer of question: "${question.title
        .substring(0, 40)
        .concat('...')}"`,
      content: `The answer that you send in ${question.title
        .substring(0, 8)
        .concat('...')} by author!`,
    })
  }
}

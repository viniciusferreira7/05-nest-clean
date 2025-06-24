import type { UniqueEntityId } from '@/core/entities/value-object/unique-entity-id'
import type { DomainEvent } from '@/core/events/domain-event'

import type { Question } from '../entities/question'

export class QuestionBestQuestionChosenEvent implements DomainEvent {
  public occurredAt: Date
  public question: Question
  public bestAnswerId: UniqueEntityId

  constructor(question: Question, bestAnswerId: UniqueEntityId) {
    this.question = question
    this.occurredAt = new Date()
    this.bestAnswerId = bestAnswerId
  }

  public getEntityId(): UniqueEntityId {
    return this.question.id
  }
}

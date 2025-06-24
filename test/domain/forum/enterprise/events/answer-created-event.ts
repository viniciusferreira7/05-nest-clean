import type { UniqueEntityId } from '@/core/entities/value-object/unique-entity-id'
import type { DomainEvent } from '@/core/events/domain-event'

import type { Answer } from '../entities/answer'

export class AnswerCreatedEvent implements DomainEvent {
  public occurredAt: Date
  public answer: Answer

  constructor(answer: Answer) {
    this.answer = answer
    this.occurredAt = new Date()
  }

  public getEntityId(): UniqueEntityId {
    return this.answer.id
  }
}

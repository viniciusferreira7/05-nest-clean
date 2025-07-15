import type { UniqueEntityId } from '@/core/entities/value-object/unique-entity-id'
import type { DomainEvent } from '@/core/events/domain-event'

import type { AnswerComment } from '../entities/answer-comment'

export class AnswerCommentCreatedEvent implements DomainEvent {
  public occurredAt: Date
  public answerComment: AnswerComment
  public answerId: UniqueEntityId

  constructor(answerComment: AnswerComment, answerId: UniqueEntityId) {
    this.answerComment = answerComment
    this.occurredAt = new Date()
    this.answerId = answerId
  }

  public getEntityId(): UniqueEntityId {
    return this.answerComment.id
  }
}

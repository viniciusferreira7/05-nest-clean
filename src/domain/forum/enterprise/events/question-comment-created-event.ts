import type { UniqueEntityId } from '@/core/entities/value-object/unique-entity-id'
import type { DomainEvent } from '@/core/events/domain-event'

import type { QuestionComment } from '../entities/question-comment'

export class QuestionCommentCreatedEvent implements DomainEvent {
  public occurredAt: Date
  public questionComment: QuestionComment
  public questionId: UniqueEntityId

  constructor(questionComment: QuestionComment, questionId: UniqueEntityId) {
    this.questionComment = questionComment
    this.occurredAt = new Date()
    this.questionId = questionId
  }

  public getEntityId(): UniqueEntityId {
    return this.questionComment.id
  }
}

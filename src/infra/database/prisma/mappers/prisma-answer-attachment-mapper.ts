import type { Attachment as PrismaAttachment } from 'generated/prisma'

import { UniqueEntityId } from '@/core/entities/value-object/unique-entity-id'
import { AnswerAttachment } from '@/domain/forum/enterprise/entities/answer-attachment'

export class PrismaAnswerAttachmentMapper {
  static toDomain(raw: PrismaAttachment): AnswerAttachment {
    if (!raw.answerId) {
      throw new Error('Invalid attachment type.')
    }

    return AnswerAttachment.create(
      {
        answerId: new UniqueEntityId(raw.answerId),
        attachmentId: new UniqueEntityId(raw.answerId),
      },
      new UniqueEntityId(raw.id),
    )
  }
}

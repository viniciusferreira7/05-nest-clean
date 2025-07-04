import type { Question as PrismaQuestion } from 'generated/prisma'

import { UniqueEntityId } from '@/core/entities/value-object/unique-entity-id'
import { Question } from '@/domain/forum/enterprise/entities/question'
import { Slug } from '@/domain/forum/enterprise/entities/value-object/slug'

export class PrismaQuestionMapper {
  static toDomain(raw: PrismaQuestion) {
    return Question.create(
      {
        title: raw.title,
        content: raw.content,
        authorId: new UniqueEntityId(raw.authorId),
        bestAnswerId: undefined, // TODO: Add in to prisma schema
        slug: Slug.create(raw.slug),
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityId(raw.id),
    )
  }
}

import { Injectable } from '@nestjs/common'

import type { PaginationParams } from '@/core/repositories/pagination-params'
import type { QuestionCommentsRepository } from '@/domain/forum/application/repositories/question-comments-repository'
import type { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment'

import type { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaQuestionCommentsRepository
  implements QuestionCommentsRepository
{
  constructor(private readonly prisma: PrismaService) {}

  findById(id: string): Promise<QuestionComment | null> {
    throw new Error('Method not implemented.')
  }

  findManyByQuestionId(
    questionId: string,
    props: PaginationParams,
  ): Promise<QuestionComment[]> {
    throw new Error('Method not implemented.')
  }

  create(questionComment: QuestionComment): Promise<void> {
    throw new Error('Method not implemented.')
  }

  delete(questionComment: QuestionComment): Promise<void> {
    throw new Error('Method not implemented.')
  }
}

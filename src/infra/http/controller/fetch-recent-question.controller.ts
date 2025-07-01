import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { z } from 'zod'

import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

const pageQueryParamSchema = z.coerce
  .number()
  .optional()
  .default(1)
  .pipe(z.number().min(1))

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class FetchRecentQuestionsController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async handler(
    @Query('page', queryValidationPipe) page: PageQueryParamSchema,
  ) {
    const questions = await this.prisma.question.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: 10,
      skip: (page - 1) * 10,
    })

    return {
      questions,
    }
  }
}

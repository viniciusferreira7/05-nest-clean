import { Controller, Post, UseGuards } from '@nestjs/common'

import { CurrentUser } from '@/auth/current-user.decorator'
import type { UserPayload } from '@/auth/jwt.strategy'
import { JwtAuthGuard } from '@/auth/jwt-auth.guard'

@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class CreateQuestionController {
  @Post()
  // @UsePipes(new ZodValidationPipe())
  async handler(@CurrentUser() user: UserPayload) {
    return user
  }
}

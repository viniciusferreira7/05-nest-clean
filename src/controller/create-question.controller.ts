import { Controller, Post, UseGuards } from '@nestjs/common'

import { JwtAuthGuard } from '@/auth/jwt-auth.guard'

@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class CreateQuestionController {
  @Post()
  // @UsePipes(new ZodValidationPipe())
  async handler() {
    return 'ok'
  }
}

import { Controller, Post } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { z } from 'zod'

const AuthenticateBodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

type AuthenticateBodySchema = z.infer<typeof AuthenticateBodySchema>

@Controller('/sessions')
export class AuthenticateController {
  constructor(private readonly jwt: JwtService) {}

  @Post()
  // @UsePipes(new ZodValidationPipe(AuthenticateBodySchema))
  // @HttpCode(201)
  async handle() {
    const token = this.jwt.sign({ sub: 'user-id' })

    return token
  }
}

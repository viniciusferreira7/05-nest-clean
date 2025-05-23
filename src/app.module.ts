import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { CreateAccountController } from '@/controller/create-account.controller'
import { PrismaService } from '@/prisma/prisma.service'

import { AuthModule } from './auth/auth.module'
import { AuthenticateController } from './controller/authenticate.controller'
import { CreateQuestionController } from './controller/create-question.controller'
import { envSchema } from './env'

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    AuthModule,
  ],
  controllers: [
    CreateAccountController,
    AuthenticateController,
    CreateQuestionController,
  ],
  providers: [PrismaService],
})
export class AppModule {}

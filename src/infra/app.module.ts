import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { CreateAccountController } from '@/infra/http/controller/create-account.controller'
import { PrismaService } from '@/infra/prisma/prisma.service'

import { AuthModule } from './auth/auth.module'
import { envSchema } from './env'
import { AuthenticateController } from './http/controller/authenticate.controller'
import { CreateQuestionController } from './http/controller/create-question.controller'
import { FetchRecentQuestionsController } from './http/controller/fetch-recent-question.controller'

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
    FetchRecentQuestionsController,
  ],
  providers: [PrismaService],
})
export class AppModule {}

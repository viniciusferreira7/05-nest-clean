import {
  Injectable,
  type OnModuleDestroy,
  type OnModuleInit,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PrismaClient } from 'generated/prisma'

import type { Env } from '@/infra/env'

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(private config: ConfigService<Env, true>) {
    console.log({ env: config.get('DATABASE_URL') })
    super({
      datasources: {
        db: {
          url: config.get('DATABASE_URL', { infer: true }),
        },
      },
      log:
        config.get('NODE_ENV') === 'dev'
          ? ['query', 'error', 'info', 'warn']
          : ['query'],
    })
  }

  onModuleInit() {
    return this.$connect()
  }

  onModuleDestroy() {
    return this.$disconnect()
  }
}

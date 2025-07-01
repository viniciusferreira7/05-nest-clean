import {
  Injectable,
  type OnModuleDestroy,
  type OnModuleInit,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PrismaClient } from 'generated/prisma'

import type { Env } from '@/env'

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(private config: ConfigService<Env, true>) {
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

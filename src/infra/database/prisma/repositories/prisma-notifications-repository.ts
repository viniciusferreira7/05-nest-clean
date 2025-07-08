import { Injectable } from '@nestjs/common'

import type { NotificationsRepository } from '@/domain/notification/application/repositories/notifications-repository'
import type { Notification } from '@/domain/notification/enterprise/entities/notification'

import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaNotificationsRepository implements NotificationsRepository {
  constructor(private readonly prisma: PrismaService) {}

  findById(id: string): Promise<Notification | null> {
    throw new Error('Method not implemented.')
  }

  create(notification: Notification): Promise<void> {
    throw new Error('Method not implemented.')
  }

  save(notification: Notification): Promise<void> {
    throw new Error('Method not implemented.')
  }
}

import { faker } from "@faker-js/faker";
import { Injectable } from "@nestjs/common";
import { UniqueEntityId } from "@/core/entities/value-object/unique-entity-id";
import {
	Notification,
	type NotificationProps,
} from "@/domain/notification/enterprise/entities/notification";
import { PrismaNotificationMapper } from "@/infra/database/prisma/mappers/prisma-notification-mapper";
import { PrismaService } from "@/infra/database/prisma/prisma.service";

export function makeNotification(
	override: Partial<NotificationProps> = {},
	id?: UniqueEntityId,
) {
	const notification = Notification.create(
		{
			recipientId: new UniqueEntityId(),
			title: faker.lorem.sentence(4),
			content: faker.lorem.sentence(),
			...override,
		},
		id,
	);

	return notification;
}

@Injectable()
export class NotificationFactory {
	constructor(private readonly prisma: PrismaService) {}

	async makePrismaNotification(data?: Partial<NotificationProps>) {
		const notification = makeNotification(data);

		await this.prisma.notification.create({
			data: PrismaNotificationMapper.toPrisma(notification),
		});

		return notification;
	}
}

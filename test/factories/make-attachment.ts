import { faker } from "@faker-js/faker";
import { Injectable } from "@nestjs/common";

import { UniqueEntityId } from "@/core/entities/value-object/unique-entity-id";
import {
	Attachment,
	type AttachmentProps,
} from "@/domain/forum/enterprise/entities/attachments";
import { PrismaAttachmentMapper } from "@/infra/database/prisma/mappers/prisma-attachment-mapper";
import { PrismaService } from "@/infra/database/prisma/prisma.service";

export function makeAttachment(
	override: Partial<AttachmentProps> = {},
	id?: UniqueEntityId,
) {
	function randomFileName() {
		const extensions = ["png", "jpg", "jpeg", "pdf"];
		const ext = faker.helpers.arrayElement(extensions);
		const baseName = faker.system.fileName({ extensionCount: 0 });
		return `${baseName}.${ext}`;
	}

	const attachment = Attachment.create(
		{
			title: randomFileName(),
			url: faker.string.uuid(),
			...override,
		},
		id,
	);

	return attachment;
}

@Injectable()
export class AttachmentFactory {
	constructor(private readonly prisma: PrismaService) {}

	async makePrismaAttachment(data?: Partial<AttachmentProps>) {
		const attachment = makeAttachment(data);

		await this.prisma.attachment.create({
			data: PrismaAttachmentMapper.toPrisma(attachment),
		});

		return attachment;
	}
}

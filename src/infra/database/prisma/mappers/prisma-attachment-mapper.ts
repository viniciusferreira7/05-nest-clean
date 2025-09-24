import type { Prisma, Attachment as PrismaAttachment } from "generated/prisma";

import { UniqueEntityId } from "@/core/entities/value-object/unique-entity-id";
import { Attachment } from "@/domain/forum/enterprise/entities/attachments";

export class PrismaAttachmentMapper {
	static toDomain(raw: PrismaAttachment): Attachment {
		return Attachment.create(
			{
				title: raw.title,
				url: raw.url,
			},
			new UniqueEntityId(raw.id),
		);
	}

	static toPrisma(
		attachment: Attachment,
	): Prisma.AttachmentUncheckedCreateInput {
		return {
			id: attachment.id.toString(),
			title: attachment.title,
			url: attachment.url,
		};
	}
}

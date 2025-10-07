import type { Prisma, Attachment as PrismaAttachment } from "generated/prisma";

import { UniqueEntityId } from "@/core/entities/value-object/unique-entity-id";
import { AnswerAttachment } from "@/domain/forum/enterprise/entities/answer-attachment";

export class PrismaAnswerAttachmentMapper {
	static toDomain(raw: PrismaAttachment): AnswerAttachment {
		if (!raw.answerId) {
			throw new Error("Invalid attachment type.");
		}

		return AnswerAttachment.create(
			{
				answerId: new UniqueEntityId(raw.answerId),
				attachmentId: new UniqueEntityId(raw.answerId),
			},
			new UniqueEntityId(raw.id),
		);
	}

	static toPrismaUpdateMany(
		attachments: AnswerAttachment[],
	): Prisma.AttachmentUpdateManyArgs {
		const attachmentIds = attachments.map((item) =>
			item.attachmentId.toString(),
		);

		const answerId = attachments[0].answerId.toString();

		return {
			where: {
				id: {
					in: attachmentIds,
				},
			},
			data: {
				answerId,
			},
		};
	}

	static toPrismaDeleteMany(
		attachments: AnswerAttachment[],
	): Prisma.AttachmentDeleteManyArgs {
		const attachmentIds = attachments.map((item) =>
			item.attachmentId.toString(),
		);

		return {
			where: {
				id: {
					in: attachmentIds,
				},
			},
		};
	}
}

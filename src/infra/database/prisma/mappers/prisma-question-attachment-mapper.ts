import type { Attachment as PrismaAttachment } from "generated/prisma";

import { UniqueEntityId } from "@/core/entities/value-object/unique-entity-id";
import { QuestionAttachment } from "@/domain/forum/enterprise/entities/question-attachment";

export class PrismaQuestionAttachmentMapper {
	static toDomain(raw: PrismaAttachment): QuestionAttachment {
		if (!raw.questionId) {
			throw new Error("Invalid attachment type.");
		}

		return QuestionAttachment.create(
			{
				questionId: new UniqueEntityId(raw.questionId),
				attachmentId: new UniqueEntityId(raw.questionId),
			},
			new UniqueEntityId(raw.id),
		);
	}
}

import { Injectable } from "@nestjs/common";
import { UniqueEntityId } from "@/core/entities/value-object/unique-entity-id";
import {
	AnswerAttachment,
	type AnswerAttachmentProps,
} from "@/domain/forum/enterprise/entities/answer-attachment";
import { PrismaService } from "@/infra/database/prisma/prisma.service";

export function makeAnswerAttachment(
	override: Partial<AnswerAttachmentProps> = {},
	id?: UniqueEntityId,
) {
	const answerAttachment = AnswerAttachment.create(
		{
			attachmentId: new UniqueEntityId(),
			answerId: new UniqueEntityId(),
			...override,
		},
		id,
	);

	return answerAttachment;
}

@Injectable()
export class AnswerAttachmentFactory {
	constructor(private readonly prisma: PrismaService) {}

	async makePrismaAnswerAttachment(data?: Partial<AnswerAttachmentProps>) {
		const answerAttachment = makeAnswerAttachment(data);

		await this.prisma.attachment.update({
			where: {
				id: answerAttachment.attachmentId.toString(),
			},
			data: {
				answerId: answerAttachment.answerId.toString(),
			},
		});

		return answerAttachment;
	}
}

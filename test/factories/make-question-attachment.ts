import { Injectable } from "@nestjs/common";
import { UniqueEntityId } from "@/core/entities/value-object/unique-entity-id";
import {
	QuestionAttachment,
	type QuestionAttachmentProps,
} from "@/domain/forum/enterprise/entities/question-attachment";
import { PrismaService } from "@/infra/database/prisma/prisma.service";

export function makeQuestionAttachment(
	override: Partial<QuestionAttachmentProps> = {},
	id?: UniqueEntityId,
) {
	const questionAttachment = QuestionAttachment.create(
		{
			attachmentId: new UniqueEntityId(),
			questionId: new UniqueEntityId(),
			...override,
		},
		id,
	);

	return questionAttachment;
}

@Injectable()
export class QuestionAttachmentFactory {
	constructor(private readonly prisma: PrismaService) {}

	async makePrismaQuestionAttachment(data?: Partial<QuestionAttachmentProps>) {
		const questionAttachment = makeQuestionAttachment(data);

		await this.prisma.attachment.update({
			where: {
				id: questionAttachment.attachmentId.toString(),
			},
			data: {
				questionId: questionAttachment.questionId.toString(),
			},
		});

		return questionAttachment;
	}
}

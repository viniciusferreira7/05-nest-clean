import { Injectable } from "@nestjs/common";

import { QuestionAttachmentsRepository } from "@/domain/forum/application/repositories/question-attachments-repository";
import { QuestionAttachment } from "@/domain/forum/enterprise/entities/question-attachment";

import { PrismaQuestionAttachmentMapper } from "../mappers/prisma-question-attachment-mapper";
import { PrismaService } from "../prisma.service";

@Injectable()
export class PrismaQuestionAttachmentsRepository
	implements QuestionAttachmentsRepository
{
	constructor(private readonly prisma: PrismaService) {}

	async createMany(attachments: QuestionAttachment[]): Promise<void> {
		if (attachments.length === 0) {
			return;
		}

		const attachmentIds = attachments.map((item) => item.id.toString());

		const questionId = attachments[0].questionId.toString();

		await this.prisma.attachment.updateMany({
			where: {
				id: {
					in: attachmentIds,
				},
			},
			data: {
				questionId,
			},
		});
	}

	async findManyByQuestionId(
		questionId: string,
	): Promise<QuestionAttachment[]> {
		const attachments = await this.prisma.attachment.findMany({
			where: {
				questionId,
			},
		});

		return attachments.map(PrismaQuestionAttachmentMapper.toDomain);
	}

	async deleteMany(attachments: QuestionAttachment[]): Promise<void> {
		if (attachments.length === 0) {
			return;
		}
		const attachmentIds = attachments.map((item) => item.id.toString());

		const questionId = attachments[0].questionId.toString();

		await this.prisma.attachment.deleteMany({
			where: {
				id: {
					in: attachmentIds,
				},
				questionId: questionId,
			},
		});
	}

	async deleteManyByQuestionId(questionId: string): Promise<void> {
		await this.prisma.attachment.deleteMany({
			where: {
				questionId,
			},
		});
	}
}

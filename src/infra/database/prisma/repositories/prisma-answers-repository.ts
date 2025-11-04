import { Injectable } from "@nestjs/common";

import { PaginationParams } from "@/core/repositories/pagination-params";
import { AnswerAttachmentsRepository } from "@/domain/forum/application/repositories/answer-attachments-repository";
import { AnswersRepository } from "@/domain/forum/application/repositories/answers-repository";
import { Answer } from "@/domain/forum/enterprise/entities/answer";
import type { AnswerWithAuthor } from "@/domain/forum/enterprise/entities/value-object/answer-with-author copy";
import { PrismaAnswerMapper } from "../mappers/prisma-answer-mapper";
import { PrismaAnswerWithAuthorMapper } from "../mappers/prisma-comment-with-author-mapper copy";
import { PrismaService } from "../prisma.service";

@Injectable()
export class PrismaAnswersRepository implements AnswersRepository {
	constructor(
		private readonly prisma: PrismaService,
		private readonly answerAttachmentsRepository: AnswerAttachmentsRepository,
	) {}

	async findById(id: string): Promise<Answer | null> {
		const answer = await this.prisma.answer.findUnique({
			where: {
				id,
			},
		});

		if (!answer) {
			return null;
		}

		return PrismaAnswerMapper.toDomain(answer);
	}

	async findManyByQuestionId(
		questionId: string,
		params: PaginationParams,
	): Promise<Answer[]> {
		const answers = await this.prisma.answer.findMany({
			where: {
				questionId,
			},
			orderBy: {
				createdAt: "desc",
			},
			take: 20,
			skip: (params.page - 1) * 20,
		});

		return answers.map(PrismaAnswerMapper.toDomain);
	}

	async findManyByQuestionIdWithAuthor(
		questionId: string,
		params: PaginationParams,
	): Promise<AnswerWithAuthor[]> {
		const answersWithAuthor = await this.prisma.answer.findMany({
			where: {
				questionId,
			},
			include: {
				author: true,
			},
			orderBy: {
				createdAt: "desc",
			},
			take: 20,
			skip: (params.page - 1) * 20,
		});

		return answersWithAuthor.map(PrismaAnswerWithAuthorMapper.toDomain);
	}

	async create(answer: Answer): Promise<void> {
		await this.prisma.answer.create({
			data: PrismaAnswerMapper.toPrisma(answer),
		});

		await this.answerAttachmentsRepository.createMany(
			answer.attachments.getItems(),
		);
	}

	async save(answer: Answer): Promise<void> {
		await this.prisma.answer.update({
			where: {
				id: answer.id.toString(),
			},
			data: PrismaAnswerMapper.toPrisma(answer),
		});

		const newAttachments = answer.attachments.getNewItems();
		const removedAttachments = answer.attachments.getRemovedItems();

		await Promise.all([
			newAttachments.length > 0
				? this.answerAttachmentsRepository.createMany(
						answer.attachments.getNewItems(),
					)
				: Promise.resolve(),

			removedAttachments.length > 0
				? this.answerAttachmentsRepository.deleteMany(
						answer.attachments.getRemovedItems(),
					)
				: Promise.resolve(),
		]);
	}

	async delete(answer: Answer): Promise<void> {
		await this.prisma.answer.delete({
			where: {
				id: answer.id.toString(),
			},
		});
	}
}

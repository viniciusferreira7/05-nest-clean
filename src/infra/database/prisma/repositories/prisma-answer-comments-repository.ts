import { Injectable } from "@nestjs/common";

import { PaginationParams } from "@/core/repositories/pagination-params";
import { AnswerCommentsRepository } from "@/domain/forum/application/repositories/answer-comments-repository";
import { AnswerComment } from "@/domain/forum/enterprise/entities/answer-comment";
import type { CommentWithAuthor } from "@/domain/forum/enterprise/entities/value-object/comment-with-author";
import { PrismaAnswerCommentMapper } from "../mappers/prisma-answer-comment-mapper";
import { PrismaCommentWithAuthorMapper } from "../mappers/prisma-comment-with-author-mapper";
import { PrismaService } from "../prisma.service";

@Injectable()
export class PrismaAnswerCommentsRepository
	implements AnswerCommentsRepository
{
	constructor(private readonly prisma: PrismaService) {}

	async findById(id: string): Promise<AnswerComment | null> {
		const answerComment = await this.prisma.comment.findUnique({
			where: {
				id,
			},
		});

		if (!answerComment) {
			return null;
		}

		return PrismaAnswerCommentMapper.toDomain(answerComment);
	}

	async findManyByAnswerId(
		answerId: string,
		params: PaginationParams,
	): Promise<AnswerComment[]> {
		const answerComments = await this.prisma.comment.findMany({
			where: {
				answerId,
			},
			orderBy: {
				createdAt: "desc",
			},
			take: 20,
			skip: (params.page - 1) * 20,
		});

		return answerComments.map(PrismaAnswerCommentMapper.toDomain);
	}

	async findManyByAnswerIdWithAuthor(
		answerId: string,
		params: PaginationParams,
	): Promise<CommentWithAuthor[]> {
		const questionComments = await this.prisma.comment.findMany({
			where: {
				answerId,
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

		return questionComments.map(PrismaCommentWithAuthorMapper.toDomain);
	}

	async create(answerComment: AnswerComment): Promise<void> {
		await this.prisma.comment.create({
			data: PrismaAnswerCommentMapper.toPrisma(answerComment),
		});
	}

	async delete(answerComment: AnswerComment): Promise<void> {
		await this.prisma.comment.delete({
			where: {
				id: answerComment.id.toString(),
			},
		});
	}
}

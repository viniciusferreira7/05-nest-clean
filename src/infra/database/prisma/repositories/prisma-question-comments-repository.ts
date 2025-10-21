import { Injectable } from "@nestjs/common";

import { PaginationParams } from "@/core/repositories/pagination-params";
import { QuestionCommentsRepository } from "@/domain/forum/application/repositories/question-comments-repository";
import { QuestionComment } from "@/domain/forum/enterprise/entities/question-comment";
import type { CommentWithAuthor } from "@/domain/forum/enterprise/entities/value-object/comment-with-author";
import { PrismaCommentWithAuthorMapper } from "../mappers/prisma-answer-with-author-mapper";
import { PrismaQuestionCommentMapper } from "../mappers/prisma-question-comment-mapper";
import { PrismaService } from "../prisma.service";

@Injectable()
export class PrismaQuestionCommentsRepository
	implements QuestionCommentsRepository
{
	constructor(private readonly prisma: PrismaService) {}

	async findById(id: string): Promise<QuestionComment | null> {
		const questionComment = await this.prisma.comment.findUnique({
			where: {
				id,
			},
		});

		if (!questionComment) {
			return null;
		}

		return PrismaQuestionCommentMapper.toDomain(questionComment);
	}

	async findManyByQuestionId(
		questionId: string,
		params: PaginationParams,
	): Promise<QuestionComment[]> {
		const questionComments = await this.prisma.comment.findMany({
			where: {
				questionId,
			},
			orderBy: {
				createdAt: "desc",
			},
			take: 20,
			skip: (params.page - 1) * 20,
		});

		return questionComments.map(PrismaQuestionCommentMapper.toDomain);
	}

	async findManyByQuestionIdWithAuthor(
		questionId: string,
		params: PaginationParams,
	): Promise<CommentWithAuthor[]> {
		const questionComments = await this.prisma.comment.findMany({
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

		return questionComments.map(PrismaCommentWithAuthorMapper.toDomain);
	}

	async create(questionComment: QuestionComment): Promise<void> {
		await this.prisma.comment.create({
			data: PrismaQuestionCommentMapper.toPrisma(questionComment),
		});
	}

	async delete(questionComment: QuestionComment): Promise<void> {
		await this.prisma.comment.delete({
			where: {
				id: questionComment.id.toString(),
			},
		});
	}
}

import { faker } from "@faker-js/faker";
import { Injectable } from "@nestjs/common";
import { UniqueEntityId } from "@/core/entities/value-object/unique-entity-id";
import {
	QuestionComment,
	type QuestionCommentProps,
} from "@/domain/forum/enterprise/entities/question-comment";
import { PrismaQuestionCommentMapper } from "@/infra/database/prisma/mappers/prisma-question-comment-mapper";
import { PrismaService } from "@/infra/database/prisma/prisma.service";

export function makeQuestionComment(
	override: Partial<QuestionCommentProps> = {},
	id?: UniqueEntityId,
) {
	const questionComment = QuestionComment.create(
		{
			authorId: new UniqueEntityId(),
			questionId: new UniqueEntityId(),
			content: faker.lorem.text(),
			...override,
		},
		id,
	);

	return questionComment;
}

@Injectable()
export class QuestionCommentFactory {
	constructor(private readonly prisma: PrismaService) {}

	async makePrismaQuestionComment(data?: Partial<QuestionCommentProps>) {
		const QuestionComment = makeQuestionComment(data);

		await this.prisma.comment.create({
			data: PrismaQuestionCommentMapper.toPrisma(QuestionComment),
		});

		return QuestionComment;
	}
}

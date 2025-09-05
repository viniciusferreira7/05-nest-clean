import { faker } from "@faker-js/faker";
import { Injectable } from "@nestjs/common";
import { UniqueEntityId } from "@/core/entities/value-object/unique-entity-id";
import {
	AnswerComment,
	type AnswerCommentProps,
} from "@/domain/forum/enterprise/entities/answer-comment";
import { PrismaAnswerCommentMapper } from "@/infra/database/prisma/mappers/prisma-answer-comment-mapper";
import { PrismaService } from "@/infra/database/prisma/prisma.service";

export function makeAnswerComment(
	override: Partial<AnswerCommentProps> = {},
	id?: UniqueEntityId,
) {
	const answerComment = AnswerComment.create(
		{
			authorId: new UniqueEntityId(),
			answerId: new UniqueEntityId(),
			content: faker.lorem.text(),
			...override,
		},
		id,
	);

	return answerComment;
}

@Injectable()
export class AnswerCommentFactory {
	constructor(private readonly prisma: PrismaService) {}

	async makePrismaAnswerComment(data?: Partial<AnswerCommentProps>) {
		const AnswerComment = makeAnswerComment(data);

		await this.prisma.comment.create({
			data: PrismaAnswerCommentMapper.toPrisma(AnswerComment),
		});

		return AnswerComment;
	}
}

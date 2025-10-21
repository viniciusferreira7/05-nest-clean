import type {
	Answer as PrismaAnswer,
	User as PrismaUser,
} from "generated/prisma";
import { UniqueEntityId } from "@/core/entities/value-object/unique-entity-id";
import { AnswerWithAuthor } from '@/domain/forum/enterprise/entities/value-object/answer-with-author copy';

type PrismaAnswerWithAuthor = PrismaAnswer & {
	author: PrismaUser;
};

export class PrismaAnswerWithAuthorMapper {
	static toDomain(raw: PrismaAnswerWithAuthor): AnswerWithAuthor {
		return AnswerWithAuthor.create({
			answerId: new UniqueEntityId(raw.id),
			questionId: new UniqueEntityId(raw.questionId),
			authorId: new UniqueEntityId(raw.authorId),
			authorName: raw.author.name,
			content: raw.content,
			createdAt: raw.createdAt,
			updatedAt: raw.updatedAt,
		});
	}
}

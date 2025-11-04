import type {
	Attachment as PrismaAttachment,
	Question as PrismaQuestion,
	User as PrismaUser,
} from "generated/prisma";
import { UniqueEntityId } from "@/core/entities/value-object/unique-entity-id";
import { QuestionDetails } from "@/domain/forum/enterprise/entities/value-object/question-details";
import { Slug } from "@/domain/forum/enterprise/entities/value-object/slug";
import { PrismaAttachmentMapper } from "./prisma-attachment-mapper";

type PrismaQuestionDetails = PrismaQuestion & {
	author: PrismaUser;
	attachments: PrismaAttachment[];
};

export class PrismaQuestionDetailsMapper {
	static toDomain(raw: PrismaQuestionDetails): QuestionDetails {
		const attachments = raw.attachments.map(PrismaAttachmentMapper.toDomain);

		return QuestionDetails.create({
			questionId: new UniqueEntityId(raw.id),
			authorId: new UniqueEntityId(raw.authorId),
			authorName: raw.author.name,
			title: raw.title,
			slug: Slug.create(raw.slug),
			content: raw.content,
			attachments: attachments,
			bestAnswerId: raw.bestAnswerId
				? new UniqueEntityId(raw.bestAnswerId)
				: null,
			createdAt: raw.createdAt,
			updatedAt: raw.updatedAt,
		});
	}
}

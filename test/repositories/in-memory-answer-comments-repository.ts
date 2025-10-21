import { DomainEvents } from "@/core/events/domain-events";
import type { PaginationParams } from "@/core/repositories/pagination-params";
import type { AnswerCommentsRepository } from "@/domain/forum/application/repositories/answer-comments-repository";
import type { AnswerComment } from "@/domain/forum/enterprise/entities/answer-comment";
import { CommentWithAuthor } from "@/domain/forum/enterprise/entities/value-object/comment-with-author";
import type { InMemoryStudentsRepository } from "./in-memory-students-repository";

export class InMemoryAnswerCommentsRepository
	implements AnswerCommentsRepository
{
	public items: AnswerComment[] = [];

	constructor(private studentsRepository: InMemoryStudentsRepository) {}

	async findById(id: string): Promise<AnswerComment | null> {
		const answerComment = this.items.find((item) => item.id.toString() === id);

		return answerComment ?? null;
	}

	async findManyByAnswerId(
		answerId: string,
		{ page }: PaginationParams,
	): Promise<AnswerComment[]> {
		const answerComments = this.items
			.filter((item) => item.answerId.toString() === answerId)
			.slice((page - 1) * 20, page * 20);

		return answerComments;
	}

	async findManyByAnswerIdWithAuthor(
		answerId: string,
		{ page }: PaginationParams,
	): Promise<CommentWithAuthor[]> {
		const answerComment = this.items
			.filter((item) => item.answerId.toString() === answerId)
			.slice((page - 1) * 20, page * 20)
			.map((comment) => {
				const authorDetails = this.studentsRepository.items.find((author) =>
					author.id.equals(comment.authorId),
				);

				if (!authorDetails) {
					throw new Error(
						`Author with ID ${comment.authorId.toString()} does not exist.`,
					);
				}

				return CommentWithAuthor.create({
					commentId: comment.id,
					content: comment.content,
					authorName: authorDetails?.name,
					authorId: authorDetails?.id,
					createdAt: comment.createdAt,
					updatedAt: comment.updatedAt,
				});
			});

		return answerComment;
	}

	async create(answerComment: AnswerComment): Promise<void> {
		this.items.push(answerComment);
		DomainEvents.dispatchEventsForEntity(answerComment.id);
	}

	async delete(answer: AnswerComment): Promise<void> {
		const itemIndex = this.items.findIndex(
			(item) => item.id.toString() === answer.id.toString(),
		);

		if (itemIndex >= 0) {
			this.items.splice(itemIndex, 1);
		}
	}
}

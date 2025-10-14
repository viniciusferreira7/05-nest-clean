import { DomainEvents } from "@/core/events/domain-events";
import type { PaginationParams } from "@/core/repositories/pagination-params";
import type { QuestionCommentsRepository } from "@/domain/forum/application/repositories/question-comments-repository";
import type { QuestionComment } from "@/domain/forum/enterprise/entities/question-comment";
import { CommentWithAuthor } from "@/domain/forum/enterprise/entities/value-object/comment-with-author";
import type { InMemoryStudentsRepository } from "./in-memory-students-repository";

export class InMemoryQuestionCommentsRepository
	implements QuestionCommentsRepository
{
	public items: QuestionComment[] = [];

	constructor(private studentsRepository: InMemoryStudentsRepository) {}

	async findById(id: string): Promise<QuestionComment | null> {
		const questionComment = this.items.find(
			(item) => item.id.toString() === id,
		);

		return questionComment ?? null;
	}

	async findManyByQuestionId(
		questionId: string,
		{ page }: PaginationParams,
	): Promise<QuestionComment[]> {
		const questionComments = this.items
			.filter((item) => item.questionId.toString() === questionId)
			.slice((page - 1) * 20, page * 20);

		return questionComments;
	}

	async findManyByQuestionIdWithAuthor(
		questionId: string,
		{ page }: PaginationParams,
	): Promise<CommentWithAuthor[]> {
		const questionComment = this.items
			.filter((item) => item.questionId.toString() === questionId)
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

		return questionComment;
	}

	async create(questionComment: QuestionComment): Promise<void> {
		this.items.push(questionComment);
		DomainEvents.dispatchEventsForEntity(questionComment.id);
	}

	async delete(question: QuestionComment): Promise<void> {
		const itemIndex = this.items.findIndex(
			(item) => item.id.toString() === question.id.toString(),
		);

		if (itemIndex >= 0) {
			this.items.splice(itemIndex, 1);
		}
	}
}

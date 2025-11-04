import { DomainEvents } from "@/core/events/domain-events";
import type { PaginationParams } from "@/core/repositories/pagination-params";
import type { AnswerAttachmentsRepository } from "@/domain/forum/application/repositories/answer-attachments-repository";
import type { AnswersRepository } from "@/domain/forum/application/repositories/answers-repository";
import type { Answer } from "@/domain/forum/enterprise/entities/answer";
import { AnswerWithAuthor } from "@/domain/forum/enterprise/entities/value-object/answer-with-author copy";
import type { InMemoryStudentsRepository } from "./in-memory-students-repository";

export class InMemoryAnswersRepository implements AnswersRepository {
	public items: Answer[] = [];

	constructor(
		private answerAttachmentsRepository: AnswerAttachmentsRepository,
		private studentsRepository: InMemoryStudentsRepository,
	) {}

	async findById(id: string): Promise<Answer | null> {
		const answer = this.items.find((item) => item.id.toString() === id);

		return answer ?? null;
	}

	async findManyByQuestionId(
		questionId: string,
		{ page }: PaginationParams,
	): Promise<Answer[]> {
		const answers = this.items
			.filter((item) => item.questionId.toString() === questionId)
			.slice((page - 1) * 20, page * 20);

		return answers;
	}

	async findManyByQuestionIdWithAuthor(
		questionId: string,
		{ page }: PaginationParams,
	): Promise<AnswerWithAuthor[]> {
		const answersWithAuthor = this.items
			.filter((item) => {
				return item.questionId.toString() === questionId;
			})
			.slice((page - 1) * 20, page * 20)
			.map((answer) => {
				const authorDetails = this.studentsRepository.items.find((author) =>
					author.id.equals(answer.authorId),
				);

				if (!authorDetails) {
					throw new Error(
						`Author with ID ${answer.authorId.toString()} does not exist.`,
					);
				}

				return AnswerWithAuthor.create({
					answerId: answer.id,
					questionId: answer.questionId,
					content: answer.content,
					authorName: authorDetails?.name,
					authorId: authorDetails?.id,
					createdAt: answer.createdAt,
					updatedAt: answer.updatedAt,
				});
			});

		return answersWithAuthor;
	}

	async save(answer: Answer): Promise<void> {
		const itemIndex = this.items.findIndex(
			(item) => item.id.toString() === answer.id.toString(),
		);

		const newAttachments = answer.attachments.getNewItems();

		if (!!newAttachments.length)
			await this.answerAttachmentsRepository.createMany(
				answer.attachments.getNewItems(),
			);

		const removedAttachments = answer.attachments.getRemovedItems();

		if (!!removedAttachments.length)
			await this.answerAttachmentsRepository.deleteMany(
				answer.attachments.getRemovedItems(),
			);

		if (itemIndex >= 0) {
			this.items[itemIndex] = answer;
			DomainEvents.dispatchEventsForEntity(answer.id);
		}
	}

	async create(answer: Answer): Promise<void> {
		this.items.push(answer);
		await this.answerAttachmentsRepository.createMany(
			answer.attachments.getItems(),
		);

		DomainEvents.dispatchEventsForEntity(answer.id);
	}

	async delete(answer: Answer): Promise<void> {
		const itemIndex = this.items.findIndex(
			(item) => item.id.toString() === answer.id.toString(),
		);

		if (itemIndex >= 0) {
			this.items.splice(itemIndex, 1);
			this.answerAttachmentsRepository.deleteManyByAnswerId(
				answer.id.toString(),
			);
		}
	}
}

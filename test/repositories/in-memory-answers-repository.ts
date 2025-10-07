import { DomainEvents } from "@/core/events/domain-events";
import type { PaginationParams } from "@/core/repositories/pagination-params";
import type { AnswerAttachmentsRepository } from "@/domain/forum/application/repositories/answer-attachments-repository";
import type { AnswersRepository } from "@/domain/forum/application/repositories/answers-repository";
import type { Answer } from "@/domain/forum/enterprise/entities/answer";

export class InMemoryAnswersRepository implements AnswersRepository {
	public items: Answer[] = [];

	constructor(
		private answerAttachmentsRepository: AnswerAttachmentsRepository,
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

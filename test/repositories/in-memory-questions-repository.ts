import { DomainEvents } from "@/core/events/domain-events";
import type { PaginationParams } from "@/core/repositories/pagination-params";
import type { QuestionsRepository } from "@/domain/forum/application/repositories/questions-repository";
import { Question } from "@/domain/forum/enterprise/entities/question";
import { QuestionDetails } from "@/domain/forum/enterprise/entities/value-object/question-details";
import type { InMemoryAttachmentsRepository } from "./in-memory-attachments-repository";
import type { InMemoryQuestionAttachmentsRepository } from "./in-memory-question-attachments";
import type { InMemoryStudentsRepository } from "./in-memory-students-repository";

export class InMemoryQuestionsRepository implements QuestionsRepository {
	public items: Question[] = [];

	constructor(
		private questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository,
		private studentsRepository: InMemoryStudentsRepository,
		private attachmentsRepository: InMemoryAttachmentsRepository,
	) {}

	async findById(id: string): Promise<Question | null> {
		const question = this.items.find((item) => item.id.toString() === id);

		return question ?? null;
	}

	async findBySlug(slug: string): Promise<Question | null> {
		const question = this.items.find((item) => item.slug.value === slug);

		return question ?? null;
	}

	async findDetailsBySlug(slug: string): Promise<QuestionDetails | null> {
		const question = this.items.find((item) => item.slug.value === slug);

		if (!question) return null;

		const author = this.studentsRepository.items.find((item) =>
			item.id.equals(question?.authorId),
		);

		if (!author) {
			throw new Error(
				`Author with ID ${question.authorId.toString()} does not exist.`,
			);
		}

		const questionAttachments =
			await this.questionAttachmentsRepository.findManyByQuestionId(
				question.id.toString(),
			);

		const attachments = questionAttachments.map((item) => {
			const attachment = this.attachmentsRepository.items.find((att) =>
				att.id.equals(item.id),
			);

			if (!attachment) {
				throw new Error(
					`Attachment with ID ${item.id.toString()} does not exist.`,
				);
			}

			return attachment;
		});

		return QuestionDetails.create({
			questionId: question.id,
			authorId: author.id,
			authorName: author.name,
			title: question.title,
			content: question.content,
			attachments: attachments,
			bestAnswerId: question.bestAnswerId,
			createdAt: question.createdAt,
			updatedAt: question.updatedAt,
		});
	}

	async findManyRecent({ page }: PaginationParams): Promise<Question[]> {
		const questions = this.items
			.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
			.slice((page - 1) * 20, page * 20);

		return questions;
	}

	async create(question: Question): Promise<void> {
		this.items.push(question);

		await this.questionAttachmentsRepository.createMany(
			question.attachments.getItems(),
		);

		DomainEvents.dispatchEventsForEntity(question.id);
	}

	async save(question: Question): Promise<void> {
		const itemIndex = this.items.findIndex(
			(item) => item.id.toString() === question.id.toString(),
		);

		const newAttachments = question.attachments.getNewItems();

		if (!!newAttachments.length)
			await this.questionAttachmentsRepository.createMany(
				question.attachments.getNewItems(),
			);

		const removedAttachments = question.attachments.getRemovedItems();

		if (!!removedAttachments.length)
			await this.questionAttachmentsRepository.deleteMany(
				question.attachments.getRemovedItems(),
			);

		if (itemIndex >= 0) {
			this.items[itemIndex] = question;
			DomainEvents.dispatchEventsForEntity(question.id);
		}
	}

	async delete(question: Question): Promise<void> {
		const itemIndex = this.items.findIndex(
			(item) => item.id.toString() === question.id.toString(),
		);

		if (itemIndex >= 0) {
			this.items.splice(itemIndex, 1);
			this.questionAttachmentsRepository.deleteManyByQuestionId(
				question.id.toString(),
			);
		}
	}
}

import { makeQuestion } from "test/factories/make-question";
import { makeQuestionAttachment } from "test/factories/make-question-attachment";
import { InMemoryAttachmentsRepository } from "test/repositories/in-memory-attachments-repository";
import { InMemoryQuestionAttachmentsRepository } from "test/repositories/in-memory-question-attachments";
import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository";
import { InMemoryStudentsRepository } from "test/repositories/in-memory-students-repository";
import { UniqueEntityId } from "@/core/entities/value-object/unique-entity-id";
import { NotAllowedError } from "@/core/errors/errors/not-allowed-error";
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error";
import { EditQuestionUseCase } from "./edit-question";

let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository;
let inMemoryStudentsRepository: InMemoryStudentsRepository;

let sut: EditQuestionUseCase;

describe("Edit question", () => {
	beforeEach(() => {
		inMemoryStudentsRepository = new InMemoryStudentsRepository();
		inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository();
		inMemoryQuestionAttachmentsRepository =
			new InMemoryQuestionAttachmentsRepository();

		inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
			inMemoryQuestionAttachmentsRepository,
			inMemoryStudentsRepository,
			inMemoryAttachmentsRepository,
		);

		sut = new EditQuestionUseCase(
			inMemoryQuestionsRepository,
			inMemoryQuestionAttachmentsRepository,
		);
	});

	it("should be able to edit a question", async () => {
		const authorId = new UniqueEntityId();
		const questionId = "question-1";

		const newQuestion = makeQuestion(
			{
				authorId,
			},
			new UniqueEntityId(questionId),
		);

		inMemoryQuestionAttachmentsRepository.items.push(
			makeQuestionAttachment({
				attachmentId: new UniqueEntityId("1"),
				questionId: newQuestion.id,
			}),
			makeQuestionAttachment({
				attachmentId: new UniqueEntityId("2"),
				questionId: newQuestion.id,
			}),
		);

		await inMemoryQuestionsRepository.create(newQuestion);

		const result = await sut.execute({
			authorId: authorId.toString(),
			questionId,
			title: "Edited title",
			content: "Edited content",
			attachmentsIds: ["1", "3"],
		});

		expect(result.isRight()).toBeTruthy();

		expect(
			inMemoryQuestionsRepository.items.some((item) => {
				const isSameAuthorId = item.authorId === authorId;
				const isSameQuestionId = item.id.toString() === questionId;
				const isSameTitleId = item.title === "Edited title";
				const isSameContentId = item.content === "Edited content";

				return (
					isSameAuthorId && isSameQuestionId && isSameTitleId && isSameContentId
				);
			}),
		).toBeTruthy();

		expect(inMemoryQuestionsRepository.items[0]).toMatchObject({
			title: "Edited title",
			content: "Edited content",
		});

		expect(
			inMemoryQuestionsRepository.items[0].attachments.currentItems,
		).toHaveLength(2);
		expect(
			inMemoryQuestionsRepository.items[0].attachments.currentItems,
		).toEqual([
			expect.objectContaining({ attachmentId: new UniqueEntityId("1") }),
			expect.objectContaining({ attachmentId: new UniqueEntityId("3") }),
		]);
	});

	it("should sync new and removed attachments when editing a question", async () => {
		const authorId = new UniqueEntityId();
		const questionId = "question-1";

		const newQuestion = makeQuestion(
			{
				authorId,
			},
			new UniqueEntityId(questionId),
		);

		inMemoryQuestionAttachmentsRepository.items.push(
			makeQuestionAttachment({
				attachmentId: new UniqueEntityId("1"),
				questionId: newQuestion.id,
			}),
			makeQuestionAttachment({
				attachmentId: new UniqueEntityId("2"),
				questionId: newQuestion.id,
			}),
		);

		await inMemoryQuestionsRepository.create(newQuestion);

		const result = await sut.execute({
			authorId: authorId.toString(),
			questionId,
			title: "Edited title",
			content: "Edited content",
			attachmentsIds: ["1", "3"],
		});

		expect(result.isRight()).toBeTruthy();

		expect(inMemoryQuestionAttachmentsRepository.items).toHaveLength(2);

		if (result.isRight()) {
			expect(inMemoryQuestionAttachmentsRepository.items).toEqual(
				expect.arrayContaining([
					expect.objectContaining({
						attachmentId: new UniqueEntityId("1"),
						questionId: result.value?.question.id,
					}),
					expect.objectContaining({
						attachmentId: new UniqueEntityId("3"),
						questionId: result.value?.question.id,
					}),
				]),
			);
		}
	});

	it("should not be able to edit question with wrong id", async () => {
		const result = await sut.execute({
			authorId: new UniqueEntityId().toString(),
			questionId: "non-id-question",
			title: "Edited title",
			content: "Edited content",
			attachmentsIds: [],
		});

		expect(result.isLeft()).toBeTruthy();
		expect(result.value).toBeInstanceOf(ResourceNotFoundError);
	});

	it("should not be able to edit question where user is not creator of question`", async () => {
		const questionId = "question-1";

		const newQuestion = makeQuestion(
			{
				authorId: new UniqueEntityId("author-1"),
			},
			new UniqueEntityId(questionId),
		);

		await inMemoryQuestionsRepository.create(newQuestion);

		const result = await sut.execute({
			authorId: "author-2",
			questionId,
			title: "Edited title",
			content: "Edited content",
			attachmentsIds: [],
		});

		expect(result.isLeft()).toBeTruthy();
		expect(result.value).toBeInstanceOf(NotAllowedError);
	});
});

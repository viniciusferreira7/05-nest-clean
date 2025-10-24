import { InMemoryAttachmentsRepository } from "test/repositories/in-memory-attachments-repository";
import { InMemoryQuestionAttachmentsRepository } from "test/repositories/in-memory-question-attachments";
import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository";
import { InMemoryStudentsRepository } from "test/repositories/in-memory-students-repository";
import { UniqueEntityId } from "@/core/entities/value-object/unique-entity-id";
import { CreateQuestionUseCase } from "./create-question";

let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository;
let inMemoryStudentsRepository: InMemoryStudentsRepository;

let sut: CreateQuestionUseCase;

describe("Create question", () => {
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
		sut = new CreateQuestionUseCase(inMemoryQuestionsRepository);
	});

	it("should be able to create an question", async () => {
		const result = await sut.execute({
			authorId: "1",
			title: "New question",
			content: "Content of question",
			attachmentsIds: ["1", "2"],
		});

		expect(result.isRight()).toBeTruthy();
		expect(result.value?.question.id).toBeTruthy();
		expect(inMemoryQuestionsRepository.items[0]).toEqual(
			result.value?.question,
		);

		expect(
			inMemoryQuestionsRepository.items[0].attachments.currentItems,
		).toHaveLength(2);
		expect(
			inMemoryQuestionsRepository.items[0].attachments.currentItems,
		).toEqual([
			expect.objectContaining({ attachmentId: new UniqueEntityId("1") }),
			expect.objectContaining({ attachmentId: new UniqueEntityId("2") }),
		]);
	});

	it("should persist attachments when creating new question", async () => {
		const result = await sut.execute({
			authorId: "1",
			title: "New question",
			content: "Content of question",
			attachmentsIds: ["1", "2"],
		});

		expect(result.isRight()).toBeTruthy();

		expect(inMemoryQuestionAttachmentsRepository.items).toHaveLength(2);
		expect(inMemoryQuestionAttachmentsRepository.items).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					attachmentId: new UniqueEntityId("1"),
					questionId: result.value?.question.id,
				}),
				expect.objectContaining({
					attachmentId: new UniqueEntityId("2"),
					questionId: result.value?.question.id,
				}),
			]),
		);
	});
});

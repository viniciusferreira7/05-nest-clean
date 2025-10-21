import { InMemoryAnswerAttachmentsRepository } from "test/repositories/in-memory-answer-attachments";
import { InMemoryAnswersRepository } from "test/repositories/in-memory-answers-repository";
import { InMemoryStudentsRepository } from "test/repositories/in-memory-students-repository";
import { UniqueEntityId } from "@/core/entities/value-object/unique-entity-id";
import { AnswerQuestionUseCase } from "./answer-question";

let inMemoryStudentsRepository: InMemoryStudentsRepository;

let inMemoryAnswerRepository: InMemoryAnswersRepository;
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;

let sut: AnswerQuestionUseCase;

describe("Create answer", () => {
	beforeEach(() => {
		inMemoryStudentsRepository = new InMemoryStudentsRepository();

		inMemoryAnswerAttachmentsRepository =
			new InMemoryAnswerAttachmentsRepository();
		inMemoryAnswerRepository = new InMemoryAnswersRepository(
			inMemoryAnswerAttachmentsRepository,
			inMemoryStudentsRepository,
		);
		sut = new AnswerQuestionUseCase(inMemoryAnswerRepository);
	});

	it("should be able to create an answer", async () => {
		const result = await sut.execute({
			authorId: "1",
			questionId: "1",
			content: "New answer",
			attachmentsIds: ["1", "2"],
		});

		expect(result.isRight()).toBeTruthy();
		expect(inMemoryAnswerRepository.items[0]).toEqual(result.value?.answer);

		expect(
			inMemoryAnswerRepository.items[0].attachments.currentItems,
		).toHaveLength(2);
		expect(inMemoryAnswerRepository.items[0].attachments.currentItems).toEqual([
			expect.objectContaining({ attachmentId: new UniqueEntityId("1") }),
			expect.objectContaining({ attachmentId: new UniqueEntityId("2") }),
		]);
	});

	it("should persist attachments when answer a question", async () => {
		const result = await sut.execute({
			authorId: "1",
			questionId: "1",
			content: "Content of question",
			attachmentsIds: ["1", "2"],
		});

		expect(result.isRight()).toBeTruthy();

		expect(inMemoryAnswerAttachmentsRepository.items).toHaveLength(2);
		expect(inMemoryAnswerAttachmentsRepository.items).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					attachmentId: new UniqueEntityId("1"),
					answerId: result.value?.answer.id,
				}),
				expect.objectContaining({
					attachmentId: new UniqueEntityId("2"),
					answerId: result.value?.answer.id,
				}),
			]),
		);
	});
});

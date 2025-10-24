import { makeQuestion } from "test/factories/make-question";
import { makeQuestionAttachment } from "test/factories/make-question-attachment";
import { InMemoryAttachmentsRepository } from "test/repositories/in-memory-attachments-repository";
import { InMemoryQuestionAttachmentsRepository } from "test/repositories/in-memory-question-attachments";
import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository";
import { InMemoryStudentsRepository } from "test/repositories/in-memory-students-repository";
import { UniqueEntityId } from "@/core/entities/value-object/unique-entity-id";
import { NotAllowedError } from "@/core/errors/errors/not-allowed-error";
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error";
import { DeleteQuestionUseCase } from "./delete-question";

let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository;
let inMemoryStudentsRepository: InMemoryStudentsRepository;

let sut: DeleteQuestionUseCase;

describe("Delete question", () => {
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

		sut = new DeleteQuestionUseCase(inMemoryQuestionsRepository);
	});

	it("should be able to delete question", async () => {
		const authorId = new UniqueEntityId();
		const questionId = "question-1";

		const newQuestion = makeQuestion(
			{
				authorId,
			},
			new UniqueEntityId(questionId),
		);

		await inMemoryQuestionsRepository.create(newQuestion);

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

		const result = await sut.execute({
			authorId: authorId.toString(),
			questionId,
		});

		expect(result.isRight()).toBeTruthy();
		expect(
			inMemoryQuestionsRepository.items.every(
				(item) => item.id.toString() !== questionId,
			),
		).toBeTruthy();
		expect(inMemoryQuestionsRepository.items).toHaveLength(0);
		expect(inMemoryQuestionAttachmentsRepository.items).toHaveLength(0);
	});

	it("should not be able to delete question with wrong id", async () => {
		const result = await sut.execute({
			authorId: new UniqueEntityId().toString(),
			questionId: "non-id-question",
		});

		expect(result.isLeft()).toBeTruthy();
		expect(result.value).toBeInstanceOf(ResourceNotFoundError);
	});

	it("should not be able to delete question where user is not creator of question`", async () => {
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
		});

		expect(result.isLeft()).toBeTruthy();
		expect(result.value).toBeInstanceOf(NotAllowedError);
	});
});

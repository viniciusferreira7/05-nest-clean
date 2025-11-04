import { makeAnswer } from "test/factories/make-answer";
import { makeStudent } from "test/factories/make-student";
import { InMemoryAnswerAttachmentsRepository } from "test/repositories/in-memory-answer-attachments";
import { InMemoryAnswersRepository } from "test/repositories/in-memory-answers-repository";
import { InMemoryStudentsRepository } from "test/repositories/in-memory-students-repository";
import { expect } from "vitest";
import { UniqueEntityId } from "@/core/entities/value-object/unique-entity-id";
import { FetchQuestionAnswersUseCase } from "./fetch-question-answers";

let inMemoryStudentsRepository: InMemoryStudentsRepository;

let inMemoryAnswerRepository: InMemoryAnswersRepository;
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;

let sut: FetchQuestionAnswersUseCase;

describe("Fetch question answers", () => {
	beforeEach(async () => {
		inMemoryStudentsRepository = new InMemoryStudentsRepository();

		inMemoryAnswerAttachmentsRepository =
			new InMemoryAnswerAttachmentsRepository();
		inMemoryAnswerRepository = new InMemoryAnswersRepository(
			inMemoryAnswerAttachmentsRepository,
			inMemoryStudentsRepository,
		);
		sut = new FetchQuestionAnswersUseCase(inMemoryAnswerRepository);
	});

	it("should be able to fetch question answers", async () => {
		const student = makeStudent();

		await inMemoryStudentsRepository.create(student);
		const questionId = new UniqueEntityId("question-1");

		const answer1 = makeAnswer({
			questionId,
			authorId: student.id,
		});
		await inMemoryAnswerRepository.create(answer1);

		const answer2 = makeAnswer({
			questionId,
			authorId: student.id,
		});
		await inMemoryAnswerRepository.create(answer2);

		const answer3 = makeAnswer({
			questionId,
			authorId: student.id,
		});
		await inMemoryAnswerRepository.create(answer3);

		const result = await sut.execute({
			questionId: questionId.toString(),
			page: 1,
		});

		expect(result.isRight()).toBeTruthy();
		expect(result.value?.answers).toHaveLength(3);

		expect(result.value?.answers).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					authorId: student.id,
					questionId: questionId,
					answerId: answer1.id,
				}),
				expect.objectContaining({
					authorId: student.id,
					questionId: questionId,
					answerId: answer2.id,
				}),
				expect.objectContaining({
					authorId: student.id,
					questionId: questionId,
					answerId: answer3.id,
				}),
			]),
		);
	});

	it("should be able to fetch paginated question answers", async () => {
		const questionId = new UniqueEntityId("question-1");

		for (let i = 0; i < 22; i++) {
			const student = makeStudent();
			await inMemoryStudentsRepository.create(student);
			await inMemoryAnswerRepository.create(
				makeAnswer({
					questionId,
					authorId: student.id,
				}),
			);
		}

		const result = await sut.execute({
			questionId: questionId.toString(),
			page: 2,
		});

		expect(result.isRight()).toBeTruthy();
		expect(result.value?.answers).toHaveLength(2);
	});
});

import { makeAnswerComment } from "test/factories/make-answer-comment";
import { makeStudent } from "test/factories/make-student";
import { InMemoryAnswerCommentsRepository } from "test/repositories/in-memory-answer-comments-repository";
import { InMemoryStudentsRepository } from "test/repositories/in-memory-students-repository";
import { expect } from "vitest";
import { UniqueEntityId } from "@/core/entities/value-object/unique-entity-id";
import { FetchAnswerCommentsUseCase } from "./fetch-answer-comments";

let inMemoryStudentsRepository: InMemoryStudentsRepository;

let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository;
let sut: FetchAnswerCommentsUseCase;

describe("Fetch answer comments", () => {
	beforeEach(async () => {
		inMemoryStudentsRepository = new InMemoryStudentsRepository();

		inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository(
			inMemoryStudentsRepository,
		);
		sut = new FetchAnswerCommentsUseCase(inMemoryAnswerCommentsRepository);
	});

	it("should be able to fetch answer comments", async () => {
		const student = makeStudent();

		await inMemoryStudentsRepository.create(student);

		const answerId = new UniqueEntityId("answer-1");

		const comment1 = makeAnswerComment({
			answerId,
			authorId: student.id,
		});

		await inMemoryAnswerCommentsRepository.create(comment1);
		const comment2 = makeAnswerComment({
			answerId,
			authorId: student.id,
		});

		await inMemoryAnswerCommentsRepository.create(comment2);

		const comment3 = makeAnswerComment({
			answerId,
			authorId: student.id,
		});

		await inMemoryAnswerCommentsRepository.create(comment3);

		const result = await sut.execute({
			answerId: answerId.toString(),
			page: 1,
		});

		expect(result.isRight()).toBeTruthy();
		expect(result.value?.comments).toHaveLength(3);
		expect(result.value?.comments).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					authorId: student.id,
					commentId: comment1.id,
				}),
				expect.objectContaining({
					authorId: student.id,
					commentId: comment2.id,
				}),
				expect.objectContaining({
					authorId: student.id,
					commentId: comment3.id,
				}),
			]),
		);
	});

	it("should be able to fetch paginated answer comments", async () => {
		const answerId = new UniqueEntityId("answer-1");

		for (let i = 0; i < 22; i++) {
			const student = makeStudent();
			await inMemoryStudentsRepository.create(student);

			await inMemoryAnswerCommentsRepository.create(
				makeAnswerComment({
					answerId,
					authorId: student.id,
				}),
			);
		}

		const result = await sut.execute({
			answerId: answerId.toString(),
			page: 2,
		});

		expect(result.isRight()).toBeTruthy();
		expect(result.value?.comments).toHaveLength(2);
	});
});

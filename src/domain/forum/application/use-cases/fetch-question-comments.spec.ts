import { makeQuestionComment } from "test/factories/make-question-comment";
import { makeStudent } from "test/factories/make-student";
import { InMemoryQuestionCommentsRepository } from "test/repositories/in-memory-question-comments-repository";
import { InMemoryStudentsRepository } from "test/repositories/in-memory-students-repository";
import { expect } from "vitest";
import { UniqueEntityId } from "@/core/entities/value-object/unique-entity-id";
import { FetchQuestionCommentsUseCase } from "./fetch-question-comments";

let inMemoryStudentsRepository: InMemoryStudentsRepository;
let inMemoryQuestionCommentRepository: InMemoryQuestionCommentsRepository;
let sut: FetchQuestionCommentsUseCase;

describe("Fetch question comments", () => {
	beforeEach(async () => {
		inMemoryStudentsRepository = new InMemoryStudentsRepository();

		inMemoryQuestionCommentRepository = new InMemoryQuestionCommentsRepository(
			inMemoryStudentsRepository,
		);
		sut = new FetchQuestionCommentsUseCase(inMemoryQuestionCommentRepository);
	});

	it("should be able to fetch question comments", async () => {
		const student = makeStudent();

		await inMemoryStudentsRepository.create(student);

		const questionId = new UniqueEntityId("question-1");

		const comment1 = makeQuestionComment({
			questionId,
			authorId: student.id,
		});

		await inMemoryQuestionCommentRepository.create(comment1);
		const comment2 = makeQuestionComment({
			questionId,
			authorId: student.id,
		});

		await inMemoryQuestionCommentRepository.create(comment2);

		const comment3 = makeQuestionComment({
			questionId,
			authorId: student.id,
		});

		await inMemoryQuestionCommentRepository.create(comment3);

		const result = await sut.execute({
			questionId: questionId.toString(),
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

	it("should be able to fetch paginated question comments", async () => {
		const questionId = new UniqueEntityId("question-1");

		for (let i = 0; i < 22; i++) {
			const student = makeStudent();
			await inMemoryStudentsRepository.create(student);

			await inMemoryQuestionCommentRepository.create(
				makeQuestionComment({
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
		expect(result.value?.comments).toHaveLength(2);
	});
});

import { makeAttachment } from "test/factories/make-attachment";
import { makeQuestion } from "test/factories/make-question";
import { makeQuestionAttachment } from "test/factories/make-question-attachment";
import { makeStudent } from "test/factories/make-student";
import { InMemoryAttachmentsRepository } from "test/repositories/in-memory-attachments-repository";
import { InMemoryQuestionAttachmentsRepository } from "test/repositories/in-memory-question-attachments";
import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository";
import { InMemoryStudentsRepository } from "test/repositories/in-memory-students-repository";
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error";
import { Slug } from "../../enterprise/entities/value-object/slug";
import { GetQuestionBySlugUseCase } from "./get-question-by-slug";

let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository;
let inMemoryStudentsRepository: InMemoryStudentsRepository;

let sut: GetQuestionBySlugUseCase;

describe("Get question by slug", () => {
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
		sut = new GetQuestionBySlugUseCase(inMemoryQuestionsRepository);
	});

	it("should be able to get question by slug", async () => {
		const student = makeStudent({
			name: "John doe",
		});

		await inMemoryStudentsRepository.create(student);

		const attachment = makeAttachment({
			title: "Some attachment",
		});

		await inMemoryAttachmentsRepository.create(attachment);

		const question = makeQuestion({
			slug: Slug.create("example-question"),
			authorId: student.id,
		});

		const questionAttachment = makeQuestionAttachment({
			attachmentId: attachment.id,
			questionId: question.id,
		});

		await inMemoryQuestionAttachmentsRepository.createMany([
			questionAttachment,
		]);

		await inMemoryQuestionsRepository.create(question);

		const result = await sut.execute({
			slug: "example-question",
		});

		expect(result.isRight()).toBeTruthy();

		if (result.isRight()) {
			expect(result.value?.question).toEqual(
				expect.objectContaining({
					questionId: question.id,
					authorId: student.id,
					authorName: student.name,
					title: question.title,
					content: question.content,
					attachments: expect.arrayContaining([
						expect.objectContaining({
							title: "Some attachment",
						}),
					]),
					bestAnswerId: question.bestAnswerId,
					createdAt: question.createdAt,
					updatedAt: question.updatedAt,
				}),
			);
		}
	});

	it("should not be able to get question with wrong slug", async () => {
		const result = await sut.execute({
			slug: "non-slug-question",
		});

		expect(result.isLeft()).toBeTruthy();
		expect(result.value).toBeInstanceOf(ResourceNotFoundError);
	});
});

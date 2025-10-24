import { makeQuestion } from "test/factories/make-question";
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
		const newQuestion = makeQuestion({
			slug: Slug.create("example-question"),
		});

		await inMemoryQuestionsRepository.create(newQuestion);

		const result = await sut.execute({
			slug: "example-question",
		});

		expect(result.isRight()).toBeTruthy();

		if (result.isRight()) {
			expect(result.value?.question.id).toBeTruthy();
			expect(inMemoryQuestionsRepository.items[0]).toEqual(
				result.value?.question,
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

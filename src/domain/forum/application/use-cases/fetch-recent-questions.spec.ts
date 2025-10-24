import { makeQuestion } from "test/factories/make-question";
import { InMemoryAttachmentsRepository } from "test/repositories/in-memory-attachments-repository";
import { InMemoryQuestionAttachmentsRepository } from "test/repositories/in-memory-question-attachments";
import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository";
import { InMemoryStudentsRepository } from "test/repositories/in-memory-students-repository";
import { FetchRecentQuestionsUseCase } from "./fetch-recent-questions";

let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository;
let inMemoryStudentsRepository: InMemoryStudentsRepository;

let sut: FetchRecentQuestionsUseCase;

describe("Fetch Recent question", () => {
	beforeEach(async () => {
		inMemoryStudentsRepository = new InMemoryStudentsRepository();
		inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository();
		inMemoryQuestionAttachmentsRepository =
			new InMemoryQuestionAttachmentsRepository();

		inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
			inMemoryQuestionAttachmentsRepository,
			inMemoryStudentsRepository,
			inMemoryAttachmentsRepository,
		);

		sut = new FetchRecentQuestionsUseCase(inMemoryQuestionsRepository);
	});

	it("should be able to fetch recent questions", async () => {
		await inMemoryQuestionsRepository.create(
			makeQuestion({
				createdAt: new Date(2000, 0, 22),
			}),
		);
		await inMemoryQuestionsRepository.create(
			makeQuestion({
				createdAt: new Date(2000, 0, 18),
			}),
		);
		await inMemoryQuestionsRepository.create(
			makeQuestion({
				createdAt: new Date(2000, 0, 15),
			}),
		);

		const result = await sut.execute({
			page: 1,
		});

		expect(result.isRight()).toBeTruthy();
		expect(result.value?.questions).toEqual([
			expect.objectContaining({
				createdAt: new Date(2000, 0, 22),
			}),
			expect.objectContaining({
				createdAt: new Date(2000, 0, 18),
			}),
			expect.objectContaining({
				createdAt: new Date(2000, 0, 15),
			}),
		]);
	});

	it("should be able to fetch paginated recent questions", async () => {
		for (let i = 0; i < 22; i++) {
			await inMemoryQuestionsRepository.create(
				makeQuestion({
					createdAt: new Date(2000, 0, 22 + i),
				}),
			);
		}

		const result = await sut.execute({
			page: 2,
		});

		expect(result.isRight()).toBeTruthy();
		expect(result.value?.questions).toHaveLength(2);
		expect(result.value?.questions).toEqual([
			expect.objectContaining({
				createdAt: new Date(2000, 0, 23),
			}),
			expect.objectContaining({
				createdAt: new Date(2000, 0, 22),
			}),
		]);
	});
});

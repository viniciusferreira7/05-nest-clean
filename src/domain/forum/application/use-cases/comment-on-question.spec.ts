import { makeQuestion } from "test/factories/make-question";
import { InMemoryAttachmentsRepository } from "test/repositories/in-memory-attachments-repository";
import { InMemoryQuestionAttachmentsRepository } from "test/repositories/in-memory-question-attachments";
import { InMemoryQuestionCommentsRepository } from "test/repositories/in-memory-question-comments-repository";
import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository";
import { InMemoryStudentsRepository } from "test/repositories/in-memory-students-repository";
import { UniqueEntityId } from "@/core/entities/value-object/unique-entity-id";
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error";
import { CommentOnQuestionUseCase } from "./comment-on-question";

let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository;
let inMemoryStudentsRepository: InMemoryStudentsRepository;

let inMemoryQuestionCommentRepository: InMemoryQuestionCommentsRepository;
let sut: CommentOnQuestionUseCase;

describe("Comment on question", () => {
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
		inMemoryQuestionCommentRepository = new InMemoryQuestionCommentsRepository(
			inMemoryStudentsRepository,
		);

		sut = new CommentOnQuestionUseCase(
			inMemoryQuestionsRepository,
			inMemoryQuestionCommentRepository,
		);
	});

	it("should be able to comment on question", async () => {
		const question = makeQuestion();

		await inMemoryQuestionsRepository.create(question);

		const result = await sut.execute({
			authorId: "author-1",
			questionId: question.id.toString(),
			content: "New comment",
		});

		expect(result.isRight()).toBeTruthy();
		expect(
			inMemoryQuestionCommentRepository.items.some(
				(item) =>
					item.authorId.toString() === "author-1" &&
					item.content === "New comment" &&
					item.questionId.toString() === question.id.toString(),
			),
		).toBeTruthy();
	});

	it("should not be able to comment on question with wrong question id", async () => {
		const result = await sut.execute({
			authorId: new UniqueEntityId().toString(),
			questionId: "non-id-question",
			content: "New comment",
		});

		expect(result.isLeft()).toBeTruthy();
		expect(result.value).toBeInstanceOf(ResourceNotFoundError);
	});
});

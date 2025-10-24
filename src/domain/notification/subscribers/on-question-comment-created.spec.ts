import { makeQuestion } from "test/factories/make-question";
import { makeQuestionComment } from "test/factories/make-question-comment";
import { InMemoryAttachmentsRepository } from "test/repositories/in-memory-attachments-repository";
import { InMemoryNotificationsRepository } from "test/repositories/in-memory-notifications-repository";
import { InMemoryQuestionAttachmentsRepository } from "test/repositories/in-memory-question-attachments";
import { InMemoryQuestionCommentsRepository } from "test/repositories/in-memory-question-comments-repository";
import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository";
import { InMemoryStudentsRepository } from "test/repositories/in-memory-students-repository";
import { waitFor } from "test/utils/wait-for";
import type { MockInstance } from "vitest";
import {
	SendNotificationUseCase,
	type SendNotificationUseCaseRequest,
	type SendNotificationUseCaseResponse,
} from "../application/use-cases/send-notification";
import { OnQuestionCommentCreated } from "./on-question-comment-created";

let inMemoryStudentsRepository: InMemoryStudentsRepository;
let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository;

let inMemoryNotificationsRepository: InMemoryNotificationsRepository;
let sendNotificationUseCase: SendNotificationUseCase;

let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository;

let sendNotificationSpy: MockInstance<
	(
		request: SendNotificationUseCaseRequest,
	) => Promise<SendNotificationUseCaseResponse>
>;

describe("On Question Comment Created", () => {
	beforeEach(() => {
		inMemoryStudentsRepository = new InMemoryStudentsRepository();
		inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository();
		inMemoryQuestionAttachmentsRepository =
			new InMemoryQuestionAttachmentsRepository();

		inMemoryQuestionCommentsRepository = new InMemoryQuestionCommentsRepository(
			inMemoryStudentsRepository,
		);

		inMemoryNotificationsRepository = new InMemoryNotificationsRepository();

		sendNotificationUseCase = new SendNotificationUseCase(
			inMemoryNotificationsRepository,
		);

		inMemoryQuestionAttachmentsRepository =
			new InMemoryQuestionAttachmentsRepository();
		inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
			inMemoryQuestionAttachmentsRepository,
			inMemoryStudentsRepository,
			inMemoryAttachmentsRepository,
		);

		sendNotificationSpy = vi.spyOn(sendNotificationUseCase, "execute");

		const _onQuestionCommentCreated = new OnQuestionCommentCreated(
			inMemoryQuestionsRepository,
			sendNotificationUseCase,
		);
	});

	it("should send a notification when an question comment is created", async () => {
		const question = makeQuestion();
		inMemoryQuestionsRepository.create(question);

		const questionComment = makeQuestionComment({ questionId: question.id });

		inMemoryQuestionCommentsRepository.create(questionComment);

		await waitFor(() => {
			expect(sendNotificationSpy).toBeCalledTimes(1);
			expect(sendNotificationSpy).toBeCalledWith({
				recipientId: question?.authorId.toString(),
				title: "New comment in your question",
				content: `Comment is ${questionComment.content
					.substring(0, 30)
					.concat("...")}`,
			});
		});
	});
});

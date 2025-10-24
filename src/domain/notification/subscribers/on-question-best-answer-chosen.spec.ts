import { makeAnswer } from "test/factories/make-answer";
import { makeQuestion } from "test/factories/make-question";
import { InMemoryAnswerAttachmentsRepository } from "test/repositories/in-memory-answer-attachments";
import { InMemoryAnswersRepository } from "test/repositories/in-memory-answers-repository";
import { InMemoryAttachmentsRepository } from "test/repositories/in-memory-attachments-repository";
import { InMemoryNotificationsRepository } from "test/repositories/in-memory-notifications-repository";
import { InMemoryQuestionAttachmentsRepository } from "test/repositories/in-memory-question-attachments";
import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository";
import { InMemoryStudentsRepository } from "test/repositories/in-memory-students-repository";
import { waitFor } from "test/utils/wait-for";
import type { MockInstance } from "vitest";
import {
	SendNotificationUseCase,
	type SendNotificationUseCaseRequest,
	type SendNotificationUseCaseResponse,
} from "../application/use-cases/send-notification";
import { OnQuestionBestAnswerChosenCreated } from "./on-question-best-answer-chosen";

let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository;
let inMemoryStudentsRepository: InMemoryStudentsRepository;

let inMemoryNotificationsRepository: InMemoryNotificationsRepository;
let sendNotificationUseCase: SendNotificationUseCase;

let inMemoryAnswersRepository: InMemoryAnswersRepository;
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;

let sendNotificationSpy: MockInstance<
	(
		request: SendNotificationUseCaseRequest,
	) => Promise<SendNotificationUseCaseResponse>
>;

describe("On Question Best Answer Chosen", () => {
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

		inMemoryNotificationsRepository = new InMemoryNotificationsRepository();

		sendNotificationUseCase = new SendNotificationUseCase(
			inMemoryNotificationsRepository,
		);

		inMemoryAnswerAttachmentsRepository =
			new InMemoryAnswerAttachmentsRepository();
		inMemoryAnswersRepository = new InMemoryAnswersRepository(
			inMemoryAnswerAttachmentsRepository,
			inMemoryStudentsRepository,
		);

		sendNotificationSpy = vi.spyOn(sendNotificationUseCase, "execute");

		const _onQuestionBestAnswerChosenCreated =
			new OnQuestionBestAnswerChosenCreated(
				inMemoryAnswersRepository,
				sendNotificationUseCase,
			);
	});

	it("should send a notification when author of question choose the best answer", async () => {
		const question = makeQuestion();

		const answer = makeAnswer({
			questionId: question.id,
		});

		inMemoryQuestionsRepository.create(question);
		inMemoryAnswersRepository.create(answer);

		question.bestAnswerId = answer.id;
		inMemoryQuestionsRepository.save(question);

		await waitFor(() => {
			expect(sendNotificationSpy).toBeCalledTimes(1);
			expect(sendNotificationSpy).toBeCalledWith({
				recipientId: answer?.authorId.toString(),
				title: `Your answer was chosen as best answer of question: "${question.title
					.substring(0, 40)
					.concat("...")}"`,
				content: `The answer that you send in ${question.title
					.substring(0, 8)
					.concat("...")} by author!`,
			});
		});
	});
});

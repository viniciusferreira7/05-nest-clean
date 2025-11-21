import { Injectable } from "@nestjs/common";
import { DomainEvents } from "@/core/events/domain-events";
import type { EventHandler } from "@/core/events/event-handler";
import { AnswersRepository } from "@/domain/forum/application/repositories/answers-repository";
import { QuestionBestAnswerChosenEvent } from "@/domain/forum/enterprise/events/question-best-answer-chosen-event";
import { SendNotificationUseCase } from "../application/use-cases/send-notification";

@Injectable()
export class OnQuestionBestAnswerChosenCreated implements EventHandler {
	constructor(
		private answersRepository: AnswersRepository,
		private sendNotificationUseCase: SendNotificationUseCase,
	) {
		this.setupSubscriptions();
	}

	setupSubscriptions(): void {
		DomainEvents.register(
			this.sendQuestionBestAnswerNotification.bind(this),
			QuestionBestAnswerChosenEvent.name,
		);
	}

	private async sendQuestionBestAnswerNotification({
		bestAnswerId,
		question,
	}: QuestionBestAnswerChosenEvent) {
		const answer = await this.answersRepository.findById(
			bestAnswerId.toString(),
		);

		if (!answer) return;

		await this.sendNotificationUseCase.execute({
			recipientId: answer?.authorId.toString(),
			title: `Your answer was chosen as best answer of question: "${
				question.title.length >= 40
					? question.title.substring(0, 40).concat("...")
					: question.title
			}"`,
			content: `The answer that you send in ${
				question.title.length >= 8
					? question.title.substring(0, 8).concat("...")
					: question.title
			} by author!`,
		});
	}
}

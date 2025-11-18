import { Module } from "@nestjs/common";
import { SendNotificationUseCase } from "@/domain/notification/application/use-cases/send-notification";
import { OnAnswerCommentCreated } from "@/domain/notification/subscribers/on-answer-comment-created";
import { OnAnswerCreated } from "@/domain/notification/subscribers/on-answer-created";
import { OnQuestionBestAnswerChosenCreated } from "@/domain/notification/subscribers/on-question-best-answer-chosen";
import { OnQuestionCommentCreated } from "@/domain/notification/subscribers/on-question-comment-created";
import { DatabaseModule } from "../database/database.module";

@Module({
	imports: [DatabaseModule],
	providers: [
		OnAnswerCreated,
		OnQuestionBestAnswerChosenCreated,
		OnQuestionCommentCreated,
		OnAnswerCommentCreated,
		SendNotificationUseCase,
	],
})
export class EventsModule {}

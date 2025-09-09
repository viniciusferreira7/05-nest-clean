import { Module } from "@nestjs/common";
import { AnswerQuestionUseCase } from "@/domain/forum/application/use-cases/answer-question";
import { AuthenticateStudentUseCase } from "@/domain/forum/application/use-cases/authenticate-student";
import { ChooseQuestionBestAnswerUseCase } from "@/domain/forum/application/use-cases/choose-question-best-answer";
import { CommentOnAnswerUseCase } from "@/domain/forum/application/use-cases/comment-on-answer";
import { CommentOnQuestionUseCase } from "@/domain/forum/application/use-cases/comment-on-question";
import { CreateQuestionUseCase } from "@/domain/forum/application/use-cases/create-question";
import { DeleteAnswerUseCase } from "@/domain/forum/application/use-cases/delete-answer";
import { DeleteAnswerCommentUseCase } from "@/domain/forum/application/use-cases/delete-answer-comment";
import { DeleteQuestionUseCase } from "@/domain/forum/application/use-cases/delete-question";
import { DeleteQuestionCommentUseCase } from "@/domain/forum/application/use-cases/delete-question-comment";
import { EditAnswerUseCase } from "@/domain/forum/application/use-cases/edit-answer";
import { EditQuestionUseCase } from "@/domain/forum/application/use-cases/edit-question";
import { FetchQuestionAnswersUseCase } from "@/domain/forum/application/use-cases/fetch-question-answers";
import { FetchRecentQuestionsUseCase } from "@/domain/forum/application/use-cases/fetch-recent-questions";
import { GetQuestionBySlugUseCase } from "@/domain/forum/application/use-cases/get-question-by-slug";
import { RegisterStudentUseCase } from "@/domain/forum/application/use-cases/register-student";
import { cryptographyModule } from "../cryptography/cryptography.module";
import { DatabaseModule } from "../database/database.module";
import { AnswerQuestionController } from "./controller/answer-question.controller";
import { AuthenticateController } from "./controller/authenticate.controller";
import { ChooseQuestionBestAnswerController } from "./controller/choose-question-best-answer.controller";
import { CommentOnAnswerController } from "./controller/comment-on-answer.controller";
import { CommentOnQuestionController } from "./controller/comment-on-question.controller";
import { CreateAccountController } from "./controller/create-account.controller";
import { CreateQuestionController } from "./controller/create-question.controller";
import { DeleteAnswerController } from "./controller/delete-answer.controller";
import { DeleteAnswerCommentController } from "./controller/delete-answer-comment.controller";
import { DeleteQuestionController } from "./controller/delete-question.controller";
import { DeleteQuestionCommentController } from "./controller/delete-question-comment.controller";
import { EditAnswerController } from "./controller/edit-answer.controller";
import { EditQuestionController } from "./controller/edit-question.controller";
import { FetchQuestionAnswersController } from "./controller/fetch-question-answers.controller.";
import { FetchRecentQuestionsController } from "./controller/fetch-recent-questions.controller";
import { GetQuestionBySlugController } from "./controller/get-question-by-slug.controller";

@Module({
	imports: [DatabaseModule, cryptographyModule],
	controllers: [
		CreateAccountController,
		AuthenticateController,
		CreateQuestionController,
		EditQuestionController,
		FetchRecentQuestionsController,
		GetQuestionBySlugController,
		DeleteQuestionController,
		AnswerQuestionController,
		EditAnswerController,
		DeleteAnswerController,
		FetchQuestionAnswersController,
		ChooseQuestionBestAnswerController,
		CommentOnQuestionController,
		DeleteQuestionCommentController,
		CommentOnAnswerController,
		DeleteAnswerCommentController,
	],
	providers: [
		CreateQuestionUseCase,
		EditQuestionUseCase,
		FetchRecentQuestionsUseCase,
		RegisterStudentUseCase,
		AuthenticateStudentUseCase,
		GetQuestionBySlugUseCase,
		DeleteQuestionUseCase,
		AnswerQuestionUseCase,
		EditAnswerUseCase,
		DeleteAnswerUseCase,
		FetchQuestionAnswersUseCase,
		ChooseQuestionBestAnswerUseCase,
		CommentOnQuestionUseCase,
		DeleteQuestionCommentUseCase,
		CommentOnAnswerUseCase,
		DeleteAnswerCommentUseCase,
	],
})
export class HttpModule {}

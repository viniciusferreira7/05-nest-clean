import {
	BadRequestException,
	Controller,
	Get,
	Param,
	Query,
} from "@nestjs/common";
import { z } from "zod";
import { FetchQuestionAnswersUseCase } from "@/domain/forum/application/use-cases/fetch-question-answers";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation.pipe";
import { AnswerWithAuthorPresenter } from "../presenters/answer-with-author-present";

const pageQueryParamSchema = z.coerce
	.number()
	.optional()
	.default(1)
	.pipe(z.number().min(1));

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>;

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema);

@Controller("/questions/:questionId/answers")
export class FetchQuestionAnswersController {
	constructor(
		private readonly fetchQuestionAnswersUseCase: FetchQuestionAnswersUseCase,
	) {}

	@Get()
	async handler(
		@Param("questionId") questionId: string,
		@Query("page", queryValidationPipe) page: PageQueryParamSchema,
	) {
		const result = await this.fetchQuestionAnswersUseCase.execute({
			questionId,
			page,
		});

		if (result.isLeft()) {
			throw new BadRequestException();
		}

		const { answers } = result.value;

		return {
			answers: answers.map(AnswerWithAuthorPresenter.toHttp),
		};
	}
}

import {
	BadRequestException,
	Controller,
	Get,
	Param,
	Query,
} from "@nestjs/common";
import { z } from "zod";
import { FetchQuestionCommentsUseCase } from "@/domain/forum/application/use-cases/fetch-question-comments";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation.pipe";
import { CommentPresenter } from "../presenters/comment-presenter";

const pageQueryParamSchema = z.coerce
	.number()
	.optional()
	.default(1)
	.pipe(z.number().min(1));

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>;

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema);

@Controller("/questions/:questionId/comments")
export class FetchQuestionCommentsController {
	constructor(
		private readonly fetchQuestionCommentsUseCase: FetchQuestionCommentsUseCase,
	) {}

	@Get()
	async handler(
		@Param("questionId") questionId: string,
		@Query("page", queryValidationPipe) page: PageQueryParamSchema,
	) {
		const result = await this.fetchQuestionCommentsUseCase.execute({
			questionId,
			page,
		});

		if (result.isLeft()) {
			throw new BadRequestException();
		}

		const { questionComments } = result.value;

		return {
			questionComments: questionComments.map(CommentPresenter.toHttp),
		};
	}
}

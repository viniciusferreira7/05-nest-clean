import {
	BadRequestException,
	Controller,
	Get,
	Param,
	Query,
} from "@nestjs/common";
import { z } from "zod";
import { FetchAnswerCommentsUseCase } from "@/domain/forum/application/use-cases/fetch-answer-comments";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation.pipe";
import { CommentWithAuthorPresenter } from "../presenters/comment-with-author-present";

const pageQueryParamSchema = z.coerce
	.number()
	.optional()
	.default(1)
	.pipe(z.number().min(1));

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>;

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema);

@Controller("/answers/:answerId/comments")
export class FetchAnswerCommentsController {
	constructor(
		private readonly fetchAnswerCommentsUseCase: FetchAnswerCommentsUseCase,
	) {}

	@Get()
	async handler(
		@Param("answerId") answerId: string,
		@Query("page", queryValidationPipe) page: PageQueryParamSchema,
	) {
		const result = await this.fetchAnswerCommentsUseCase.execute({
			answerId,
			page,
		});

		if (result.isLeft()) {
			throw new BadRequestException();
		}

		const { comments } = result.value;

		return {
			comments: comments.map(CommentWithAuthorPresenter.toHttp),
		};
	}
}

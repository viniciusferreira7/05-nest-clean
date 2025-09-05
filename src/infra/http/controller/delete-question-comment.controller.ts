import {
	BadRequestException,
	Controller,
	Delete,
	HttpCode,
	Param,
} from "@nestjs/common";
import { DeleteQuestionCommentUseCase } from "@/domain/forum/application/use-cases/delete-question-comment";
import { CurrentUser } from "@/infra/auth/current-user.decorator";
import type { UserPayload } from "@/infra/auth/jwt.strategy";

@Controller("/questions/comments/:id")
export class DeleteQuestionCommentController {
	constructor(
		private readonly deleteQuestionCommentUseCase: DeleteQuestionCommentUseCase,
	) {}

	@Delete()
	@HttpCode(204)
	async handler(
		@CurrentUser() user: UserPayload,
		@Param("id") questionCommentId: string,
	) {
		const { sub: userId } = user;

		const result = await this.deleteQuestionCommentUseCase.execute({
			questionCommentId,
			authorId: userId,
		});

		if (result.isLeft()) {
			throw new BadRequestException();
		}
	}
}

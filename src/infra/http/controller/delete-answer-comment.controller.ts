import {
	BadRequestException,
	Controller,
	Delete,
	HttpCode,
	Param,
} from "@nestjs/common";
import { DeleteAnswerCommentUseCase } from "@/domain/forum/application/use-cases/delete-answer-comment";
import { CurrentUser } from "@/infra/auth/current-user.decorator";
import type { UserPayload } from "@/infra/auth/jwt.strategy";

@Controller("/answers/comments/:id")
export class DeleteAnswerCommentController {
	constructor(
		private readonly deleteAnswerCommentUseCase: DeleteAnswerCommentUseCase,
	) {}

	@Delete()
	@HttpCode(204)
	async handler(
		@CurrentUser() user: UserPayload,
		@Param("id") answerCommentId: string,
	) {
		const { sub: userId } = user;

		const result = await this.deleteAnswerCommentUseCase.execute({
			answerCommentId,
			authorId: userId,
		});

		if (result.isLeft()) {
			throw new BadRequestException();
		}
	}
}

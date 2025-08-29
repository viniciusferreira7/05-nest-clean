import {
	BadRequestException,
	Controller,
	Delete,
	HttpCode,
	Param,
	Put,
} from "@nestjs/common";

import { DeleteQuestionUseCase } from "@/domain/forum/application/use-cases/delete-question";
import { CurrentUser } from "@/infra/auth/current-user.decorator";
import type { UserPayload } from "@/infra/auth/jwt.strategy";

@Controller("/questions/:id")
export class DeleteQuestionController {
	constructor(private readonly deleteQuestionUseCase: DeleteQuestionUseCase) {}

	@Delete()
	@HttpCode(204)
	async handler(
		@CurrentUser() user: UserPayload,
		@Param("id") questionId: string,
	) {
		const { sub: userId } = user;

		const result = await this.deleteQuestionUseCase.execute({
			questionId,
			authorId: userId,
		});

		if (result.isLeft()) {
			throw new BadRequestException();
		}
	}
}

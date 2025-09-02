import {
	BadRequestException,
	Controller,
	Delete,
	HttpCode,
	Param,
} from "@nestjs/common";

import { DeleteAnswerUseCase } from "@/domain/forum/application/use-cases/delete-answer";
import { CurrentUser } from "@/infra/auth/current-user.decorator";
import type { UserPayload } from "@/infra/auth/jwt.strategy";

@Controller("/answers/:id")
export class DeleteAnswerController {
	constructor(private readonly deleteAnswerUseCase: DeleteAnswerUseCase) {}

	@Delete()
	@HttpCode(204)
	async handler(
		@CurrentUser() user: UserPayload,
		@Param("id") answerId: string,
	) {
		const { sub: userId } = user;

		const result = await this.deleteAnswerUseCase.execute({
			answerId,
			authorId: userId,
		});

		if (result.isLeft()) {
			throw new BadRequestException();
		}
	}
}

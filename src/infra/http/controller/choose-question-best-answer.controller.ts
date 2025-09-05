import {
	BadRequestException,
	Controller,
	HttpCode,
	Param,
	Patch,
} from "@nestjs/common";
import { ChooseQuestionBestAnswerUseCase } from "@/domain/forum/application/use-cases/choose-question-best-answer";
import { CurrentUser } from "@/infra/auth/current-user.decorator";
import type { UserPayload } from "@/infra/auth/jwt.strategy";

@Controller("/answers/:answerId/choose-as-best")
export class ChooseQuestionBestAnswerController {
	constructor(
		private readonly chooseQuestionBestAnswerUseCase: ChooseQuestionBestAnswerUseCase,
	) {}

	@Patch()
	@HttpCode(204)
	async handler(
		@CurrentUser() user: UserPayload,
		@Param("answerId") answerId: string,
	) {
		const { sub: userId } = user;

		const result = await this.chooseQuestionBestAnswerUseCase.execute({
			answerId,
			authorId: userId,
		});

		if (result.isLeft()) {
			throw new BadRequestException();
		}
	}
}

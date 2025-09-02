import {
	BadRequestException,
	Body,
	Controller,
	Param,
	Post,
} from "@nestjs/common";
import { z } from "zod";
import { AnswerQuestionUseCase } from "@/domain/forum/application/use-cases/answer-question";
import { CurrentUser } from "@/infra/auth/current-user.decorator";
import type { UserPayload } from "@/infra/auth/jwt.strategy";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation.pipe";

const answerQuestionBodySchema = z.object({
	content: z.string(),
});

const bodyValidationPipe = new ZodValidationPipe(answerQuestionBodySchema);

type AnswerQuestionBodySchema = z.infer<typeof answerQuestionBodySchema>;

@Controller("/questions/:questionId/answers")
export class AnswerQuestionController {
	constructor(private readonly answerQuestionUseCase: AnswerQuestionUseCase) {}

	@Post()
	async handler(
		@Body(bodyValidationPipe) body: AnswerQuestionBodySchema,
		@CurrentUser() user: UserPayload,
		@Param("questionId") questionId: string,
	) {
		const { content } = body;
		const { sub: userId } = user;

		const result = await this.answerQuestionUseCase.execute({
			content,
			questionId,
			authorId: userId,
			attachmentsIds: [],
		});

		if (result.isLeft()) {
			throw new BadRequestException();
		}
	}
}

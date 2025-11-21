import {
	BadRequestException,
	Controller,
	HttpCode,
	Param,
	Patch,
} from "@nestjs/common";
import { NotAllowedError } from "@/core/errors/errors/not-allowed-error";
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error";
import { ReadNotificationUseCase } from "@/domain/notification/application/use-cases/read-notification";
import { CurrentUser } from "@/infra/auth/current-user.decorator";
import type { UserPayload } from "@/infra/auth/jwt.strategy";

@Controller("/notifications/:notificationId/read")
export class ReadNotificationController {
	constructor(
		private readonly readNotificationUseCase: ReadNotificationUseCase,
	) {}

	@Patch()
	@HttpCode(204)
	async handler(
		@CurrentUser() user: UserPayload,
		@Param("notificationId") notificationId: string,
	) {
		const result = await this.readNotificationUseCase.execute({
			notificationId,
			recipientId: user.sub,
		});

		if (result.isLeft()) {
			const error = result.value;

			switch (error.constructor) {
				case ResourceNotFoundError:
					throw new ResourceNotFoundError();
				case NotAllowedError:
					throw new NotAllowedError();
				default:
					throw new BadRequestException(error.message);
			}
		}
	}
}

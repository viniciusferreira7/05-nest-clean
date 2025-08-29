import {
	Injectable,
	type OnModuleDestroy,
	type OnModuleInit,
} from "@nestjs/common";
import { PrismaClient } from "generated/prisma";

import { EnvService } from "@/infra/env/env.service";

@Injectable()
export class PrismaService
	extends PrismaClient
	implements OnModuleInit, OnModuleDestroy
{
	constructor(private readonly envService: EnvService) {
		super({
			datasources: {
				db: {
					url: envService.get("DATABASE_URL"),
				},
			},
			log:
				envService.get("NODE_ENV") === "dev"
					? ["query", "error", "info", "warn"]
					: ["query"],
		});
	}

	onModuleInit() {
		return this.$connect();
	}

	onModuleDestroy() {
		return this.$disconnect();
	}
}

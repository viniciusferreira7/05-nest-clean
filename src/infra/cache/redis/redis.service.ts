import { Injectable, OnModuleDestroy } from "@nestjs/common";
import Redis from "ioredis";
import { EnvService } from "@/infra/env/env.service";

@Injectable()
export class RedisService extends Redis implements OnModuleDestroy {
	constructor(private readonly envService: EnvService) {
		super({
			host: envService.get("REDIS_HOST"),
			port: Number(envService.get("REDIS_PORT")) || 6379,
			db: Number(envService.get("REDIS_DB")) || 0,
			password: envService.get("REDIS_PASSWORD"),
		});
	}

	onModuleDestroy() {
		return this.disconnect();
	}
}

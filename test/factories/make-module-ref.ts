import "dotenv/config";

import { Test, TestingModule } from "@nestjs/testing";
import { PrismaClient } from "generated/prisma";

import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { AnswerFactory } from "./make-answer";
import { AnswerCommentFactory } from "./make-answer-comment";
import { QuestionFactory } from "./make-question";
import { QuestionCommentFactory } from "./make-question-comment";
import { StudentFactory } from "./make-student";

export async function makeModuleRef(): Promise<TestingModule> {
	const databaseUrl = process.env.DATABASE_URL;
	const moduleRef = await Test.createTestingModule({
		imports: [AppModule, DatabaseModule],
		providers: [
			StudentFactory,
			QuestionFactory,
			AnswerFactory,
			QuestionCommentFactory,
			AnswerCommentFactory,
		],
	})
		.overrideProvider(PrismaService)
		.useFactory({
			factory() {
				return new PrismaClient({
					datasources: {
						db: {
							url: databaseUrl,
						},
					},
				});
			},
		})
		.compile();

	console.log({ moduleRef });

	return moduleRef;
}

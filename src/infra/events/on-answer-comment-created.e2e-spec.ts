import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import request from "supertest";
import { AnswerFactory } from "test/factories/make-answer";
import { makeModuleRef } from "test/factories/make-module-ref";
import { QuestionFactory } from "test/factories/make-question";
import { StudentFactory } from "test/factories/make-student";
import { waitFor } from "test/utils/wait-for";
import { PrismaService } from "@/infra/database/prisma/prisma.service";

describe("On answer comment created (E2E)", () => {
	let app: INestApplication;
	let prisma: PrismaService;
	let studentFactory: StudentFactory;
	let questionFactory: QuestionFactory;
	let answerFactory: AnswerFactory;
	let jwt: JwtService;

	beforeAll(async () => {
		const moduleRef = await makeModuleRef();

		app = moduleRef.createNestApplication();
		prisma = moduleRef.get(PrismaService);
		studentFactory = moduleRef.get(StudentFactory);
		questionFactory = moduleRef.get(QuestionFactory);
		answerFactory = moduleRef.get(AnswerFactory);
		jwt = moduleRef.get(JwtService);

		await app.init();
	});

	it("should be able to sent notification when answer comment is created", async () => {
		const user = await studentFactory.makePrismaStudent();

		const question = await questionFactory.makePrismaQuestion({
			authorId: user.id,
		});

		const answer = await answerFactory.makePrismaAnswer({
			authorId: user.id,
			questionId: question.id,
		});

		const answerCommentContent = "Comment on answer content";

		const accessToken = jwt.sign({ sub: user.id.toString() });

		await request(app.getHttpServer())
			.post(`/answers/${answer.id}/comments`)
			.send({
				content: answerCommentContent,
			})
			.set("Authorization", `Bearer ${accessToken}`);

		await waitFor(async () => {
			const notificationOnDatabase = await prisma.notification.findFirst({
				where: {
					recipientId: user.id.toString(),
					title: "New comment in your answer",
					content: `Comment is ${
						answerCommentContent.length >= 30
							? answerCommentContent.substring(0, 30).concat("...")
							: answerCommentContent
					}`,
				},
			});

			expect(notificationOnDatabase).not.toBeNull();
		});
	});

	afterAll(async () => {
		await app.close();
	});
});

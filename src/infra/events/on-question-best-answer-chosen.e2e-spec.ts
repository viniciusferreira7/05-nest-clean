import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import request from "supertest";
import { AnswerFactory } from "test/factories/make-answer";
import { makeModuleRef } from "test/factories/make-module-ref";
import { QuestionFactory } from "test/factories/make-question";
import { StudentFactory } from "test/factories/make-student";
import { waitFor } from "test/utils/wait-for";
import { DomainEvents } from "@/core/events/domain-events";
import { PrismaService } from "@/infra/database/prisma/prisma.service";

describe("On question best answer chosen (E2E)", () => {
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

		DomainEvents.shouldRun = true;

		await app.init();
	});

	it("should be able to send a notification when answer is chosen as best answer for question", async () => {
		const user = await studentFactory.makePrismaStudent();

		const question = await questionFactory.makePrismaQuestion({
			authorId: user.id,
		});
		const answer = await answerFactory.makePrismaAnswer({
			authorId: user.id,
			questionId: question.id,
		});

		const accessToken = jwt.sign({ sub: user.id.toString() });

		await request(app.getHttpServer())
			.patch(`/answers/${answer.id}/choose-as-best`)
			.send()
			.set("Authorization", `Bearer ${accessToken}`);

		await waitFor(async () => {
			const notificationOnDatabase = await prisma.notification.findFirst({
				where: {
					recipientId: user.id.toString(),
					title: `Your answer was chosen as best answer of question: "${
						question.title.length >= 40
							? question.title.substring(0, 40).concat("...")
							: question.title
					}"`,
					content: `The answer that you send in ${
						question.title.length >= 8
							? question.title.substring(0, 8).concat("...")
							: question.title
					} by author!`,
				},
			});

			expect(notificationOnDatabase).not.toBeNull();
		});
	});

	afterAll(async () => {
		await app.close();
	});
});

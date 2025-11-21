import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import request from "supertest";
import { makeModuleRef } from "test/factories/make-module-ref";
import { QuestionFactory } from "test/factories/make-question";
import { QuestionCommentFactory } from "test/factories/make-question-comment";
import { StudentFactory } from "test/factories/make-student";
import { waitFor } from "test/utils/wait-for";
import { PrismaService } from "@/infra/database/prisma/prisma.service";

describe("On question comment created (E2E)", () => {
	let app: INestApplication;
	let prisma: PrismaService;
	let studentFactory: StudentFactory;
	let questionFactory: QuestionFactory;
	let questionCommentFactory: QuestionCommentFactory;
	let jwt: JwtService;

	beforeAll(async () => {
		const moduleRef = await makeModuleRef();

		app = moduleRef.createNestApplication();
		prisma = moduleRef.get(PrismaService);
		studentFactory = moduleRef.get(StudentFactory);
		questionFactory = moduleRef.get(QuestionFactory);
		questionCommentFactory = moduleRef.get(QuestionCommentFactory);
		jwt = moduleRef.get(JwtService);

		await app.init();
	});

	it("should be able to send notification when question comment created", async () => {
		const user = await studentFactory.makePrismaStudent();
		const question = await questionFactory.makePrismaQuestion({
			authorId: user.id,
		});

		const accessToken = jwt.sign({ sub: user.id.toString() });

		const questionCommentContent = "Comment on question content";

		await request(app.getHttpServer())
			.post(`/questions/${question.id}/comments`)
			.send({
				content: questionCommentContent,
			})
			.set("Authorization", `Bearer ${accessToken}`);

		await waitFor(async () => {
			const notificationOnDatabase = await prisma.notification.findFirst({
				where: {
					recipientId: user.id.toString(),
					title: "New comment in your question",
					content: `Comment is ${
						questionCommentContent.length >= 30
							? questionCommentContent.substring(0, 30).concat("...")
							: questionCommentContent
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

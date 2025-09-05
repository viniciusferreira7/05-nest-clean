import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import request from "supertest";
import { makeModuleRef } from "test/factories/make-module-ref";
import { QuestionFactory } from "test/factories/make-question";
import { QuestionCommentFactory } from "test/factories/make-question-comment";
import { StudentFactory } from "test/factories/make-student";
import { PrismaService } from "@/infra/database/prisma/prisma.service";

describe("Comment on question (E2E)", () => {
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

	test("[POST]: /questions/:questionId/comments", async () => {
		const user = await studentFactory.makePrismaStudent();
		const question = await questionFactory.makePrismaQuestion({
			authorId: user.id,
		});

		const accessToken = jwt.sign({ sub: user.id.toString() });

		const response = await request(app.getHttpServer())
			.post(`/questions/${question.id}/comments`)
			.send({
				content: "Comment on question content",
			})
			.set("Authorization", `Bearer ${accessToken}`);

		expect(response.statusCode).toBe(201);

		const questionCommentOnDatabase = await prisma.comment.findFirst({
			where: {
				authorId: user.id.toString(),
				questionId: question.id.toString(),
				content: "Comment on question content",
			},
		});

		expect(questionCommentOnDatabase).toEqual(
			expect.objectContaining({
				content: "Comment on question content",
				authorId: user.id.toString(),
				questionId: question.id.toString(),
			}),
		);
	});

	afterAll(async () => {
		await app.close();
	});
});

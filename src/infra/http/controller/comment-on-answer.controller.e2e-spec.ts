import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import request from "supertest";
import { AnswerFactory } from "test/factories/make-answer";
import { AnswerCommentFactory } from "test/factories/make-answer-comment";
import { makeModuleRef } from "test/factories/make-module-ref";
import { QuestionFactory } from "test/factories/make-question";
import { StudentFactory } from "test/factories/make-student";
import { PrismaService } from "@/infra/database/prisma/prisma.service";

describe("Comment on answer (E2E)", () => {
	let app: INestApplication;
	let prisma: PrismaService;
	let studentFactory: StudentFactory;
	let questionFactory: QuestionFactory;
	let answerFactory: AnswerFactory;
	let answerCommentFactory: AnswerCommentFactory;
	let jwt: JwtService;

	beforeAll(async () => {
		const moduleRef = await makeModuleRef();

		app = moduleRef.createNestApplication();
		prisma = moduleRef.get(PrismaService);
		studentFactory = moduleRef.get(StudentFactory);
		questionFactory = moduleRef.get(QuestionFactory);
		answerFactory = moduleRef.get(AnswerFactory);
		answerCommentFactory = moduleRef.get(AnswerCommentFactory);
		jwt = moduleRef.get(JwtService);

		await app.init();
	});

	test("[POST]: /answers/:answerId/comments", async () => {
		const user = await studentFactory.makePrismaStudent();

		const question = await questionFactory.makePrismaQuestion({
			authorId: user.id,
		});

		const answer = await answerFactory.makePrismaAnswer({
			authorId: user.id,
			questionId: question.id,
		});

		const accessToken = jwt.sign({ sub: user.id.toString() });

		const response = await request(app.getHttpServer())
			.post(`/answers/${answer.id}/comments`)
			.send({
				content: "Comment on answer content",
			})
			.set("Authorization", `Bearer ${accessToken}`);

		expect(response.statusCode).toBe(201);

		const answerCommentOnDatabase = await prisma.comment.findFirst({
			where: {
				authorId: user.id.toString(),
				answerId: answer.id.toString(),
				content: "Comment on answer content",
			},
		});

		expect(answerCommentOnDatabase).toEqual(
			expect.objectContaining({
				content: "Comment on answer content",
				authorId: user.id.toString(),
				answerId: answer.id.toString(),
			}),
		);
	});

	afterAll(async () => {
		await app.close();
	});
});

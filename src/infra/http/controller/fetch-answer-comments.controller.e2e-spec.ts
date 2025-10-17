import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import request from "supertest";
import { AnswerFactory } from "test/factories/make-answer";
import { AnswerCommentFactory } from "test/factories/make-answer-comment";
import { makeModuleRef } from "test/factories/make-module-ref";
import { QuestionFactory } from "test/factories/make-question";
import { StudentFactory } from "test/factories/make-student";

describe("Fetch answer comments (E2E)", () => {
	let app: INestApplication;
	let jwt: JwtService;
	let studentFactory: StudentFactory;
	let answerFactory: AnswerFactory;
	let questionFactory: QuestionFactory;
	let answerCommentFactory: AnswerCommentFactory;

	beforeAll(async () => {
		const moduleRef = await makeModuleRef();

		app = moduleRef.createNestApplication();
		studentFactory = moduleRef.get(StudentFactory);
		jwt = moduleRef.get(JwtService);
		questionFactory = moduleRef.get(QuestionFactory);
		answerFactory = moduleRef.get(AnswerFactory);
		answerCommentFactory = moduleRef.get(AnswerCommentFactory);

		await app.init();
	});

	test("[GET]: /answers/:answerId/comments", async () => {
		const user = await studentFactory.makePrismaStudent({
			name: "John Doe",
		});

		const accessToken = jwt.sign({ sub: user.id.toString() });

		const question = await questionFactory.makePrismaQuestion({
			title: "New question 1",
			authorId: user?.id,
		});

		const answer = await answerFactory.makePrismaAnswer({
			content: "New answer 1",
			authorId: user?.id,
			questionId: question.id,
		});

		await Promise.all([
			answerCommentFactory.makePrismaAnswerComment({
				content: "New comment 1",
				authorId: user?.id,
				answerId: answer.id,
			}),
			answerCommentFactory.makePrismaAnswerComment({
				content: "New comment 2",
				authorId: user?.id,
				answerId: answer.id,
			}),
			answerCommentFactory.makePrismaAnswerComment({
				content: "New comment 3",
				authorId: user?.id,
				answerId: answer.id,
			}),
		]);

		const response = await request(app.getHttpServer())
			.get(`/answers/${answer.id.toString()}/comments?page=1`)
			.set("Authorization", `Bearer ${accessToken}`);

		expect(response.statusCode).toBe(200);

		expect(response.body).toEqual(
			expect.objectContaining({
				comments: expect.arrayContaining([
					expect.objectContaining({
						content: "New comment 3",
						authorName: "John Doe",
					}),
					expect.objectContaining({
						content: "New comment 2",
						authorName: "John Doe",
					}),
					expect.objectContaining({
						content: "New comment 1",
						authorName: "John Doe",
					}),
				]),
			}),
		);

		expect(response.body.comments).toHaveLength(3);
	});

	afterAll(async () => {
		await app.close();
	});
});

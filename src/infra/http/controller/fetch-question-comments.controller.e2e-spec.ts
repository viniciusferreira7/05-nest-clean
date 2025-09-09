import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import request from "supertest";
import { makeModuleRef } from "test/factories/make-module-ref";
import { QuestionFactory } from "test/factories/make-question";
import { QuestionCommentFactory } from "test/factories/make-question-comment";
import { StudentFactory } from "test/factories/make-student";

describe("Fetch question comments (E2E)", () => {
	let app: INestApplication;
	let jwt: JwtService;
	let studentFactory: StudentFactory;
	let questionFactory: QuestionFactory;
	let questionCommentFactory: QuestionCommentFactory;

	beforeAll(async () => {
		const moduleRef = await makeModuleRef();

		app = moduleRef.createNestApplication();
		studentFactory = moduleRef.get(StudentFactory);
		jwt = moduleRef.get(JwtService);
		questionFactory = moduleRef.get(QuestionFactory);
		questionCommentFactory = moduleRef.get(QuestionCommentFactory);

		await app.init();
	});

	test("[GET]: /questions/:questionId/comments", async () => {
		const user = await studentFactory.makePrismaStudent();

		const accessToken = jwt.sign({ sub: user.id.toString() });

		const question = await questionFactory.makePrismaQuestion({
			title: "New question 1",
			authorId: user?.id,
		});

		await Promise.all([
			questionCommentFactory.makePrismaQuestionComment({
				content: "New comment 1",
				authorId: user?.id,
				questionId: question.id,
			}),
			questionCommentFactory.makePrismaQuestionComment({
				content: "New comment 2",
				authorId: user?.id,
				questionId: question.id,
			}),
			questionCommentFactory.makePrismaQuestionComment({
				content: "New comment 3",
				authorId: user?.id,
				questionId: question.id,
			}),
		]);

		const response = await request(app.getHttpServer())
			.get(`/questions/${question.id.toString()}/comments?page=1`)
			.set("Authorization", `Bearer ${accessToken}`);

		expect(response.statusCode).toBe(200);

		expect(response.body).toEqual(
			expect.objectContaining({
				questionComments: expect.arrayContaining([
					expect.objectContaining({
						content: "New comment 3",
					}),
					expect.objectContaining({
						content: "New comment 2",
					}),
					expect.objectContaining({
						content: "New comment 1",
					}),
				]),
			}),
		);

		expect(response.body.questionComments).toHaveLength(3);
	});

	afterAll(async () => {
		await app.close();
	});
});

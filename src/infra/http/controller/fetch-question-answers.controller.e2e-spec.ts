import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import request from "supertest";
import { AnswerFactory } from "test/factories/make-answer";
import { makeModuleRef } from "test/factories/make-module-ref";
import { QuestionFactory } from "test/factories/make-question";
import { StudentFactory } from "test/factories/make-student";

describe("Fetch answer answers (E2E)", () => {
	let app: INestApplication;
	let jwt: JwtService;
	let studentFactory: StudentFactory;
	let questionFactory: QuestionFactory;
	let answerFactory: AnswerFactory;

	beforeAll(async () => {
		const moduleRef = await makeModuleRef();

		app = moduleRef.createNestApplication();
		studentFactory = moduleRef.get(StudentFactory);
		jwt = moduleRef.get(JwtService);
		questionFactory = moduleRef.get(QuestionFactory);
		answerFactory = moduleRef.get(AnswerFactory);

		await app.init();
	});

	test("[GET]: /questions/:questionId/answers", async () => {
		const user = await studentFactory.makePrismaStudent();

		const accessToken = jwt.sign({ sub: user.id.toString() });

		const question = await questionFactory.makePrismaQuestion({
			title: "New question 1",
			authorId: user?.id,
		});

		await Promise.all([
			answerFactory.makePrismaAnswer({
				content: "New answer 1",
				authorId: user?.id,
				questionId: question.id,
			}),
			answerFactory.makePrismaAnswer({
				content: "New answer 2",
				authorId: user?.id,
				questionId: question.id,
			}),
			answerFactory.makePrismaAnswer({
				content: "New answer 3",
				authorId: user?.id,
				questionId: question.id,
			}),
		]);

		const response = await request(app.getHttpServer())
			.get(`/questions/${question.id.toString()}/answers?page=1`)
			.set("Authorization", `Bearer ${accessToken}`);

		expect(response.statusCode).toBe(200);

		expect(response.body).toEqual(
			expect.objectContaining({
				answers: expect.arrayContaining([
					expect.objectContaining({
						content: "New answer 3",
					}),
					expect.objectContaining({
						content: "New answer 2",
					}),
					expect.objectContaining({
						content: "New answer 1",
					}),
				]),
			}),
		);

		expect(response.body.answers).toHaveLength(3);
	});

	afterAll(async () => {
		await app.close();
	});
});

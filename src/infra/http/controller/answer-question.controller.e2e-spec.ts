import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import request from "supertest";
import { makeModuleRef } from "test/factories/make-module-ref";
import { QuestionFactory } from "test/factories/make-question";
import { StudentFactory } from "test/factories/make-student";
import { PrismaService } from "@/infra/database/prisma/prisma.service";

describe("Answer question (E2E)", () => {
	let app: INestApplication;
	let prisma: PrismaService;
	let studentFactory: StudentFactory;
	let questionFactory: QuestionFactory;
	let jwt: JwtService;

	beforeAll(async () => {
		const moduleRef = await makeModuleRef();

		app = moduleRef.createNestApplication();
		prisma = moduleRef.get(PrismaService);
		studentFactory = moduleRef.get(StudentFactory);
		questionFactory = moduleRef.get(QuestionFactory);
		jwt = moduleRef.get(JwtService);

		await app.init();
	});

	test("[POST]: /questions/:questionId/answers", async () => {
		const user = await studentFactory.makePrismaStudent();
		const question = await questionFactory.makePrismaQuestion({
			authorId: user.id,
		});

		const accessToken = jwt.sign({ sub: user.id.toString() });

		const response = await request(app.getHttpServer())
			.post(`/questions/${question.id}/answers`)
			.send({
				content: "Answer question content",
			})
			.set("Authorization", `Bearer ${accessToken}`);

		expect(response.statusCode).toBe(201);

		const questionOnDatabase = await prisma.answer.findFirst({
			where: {
				authorId: user.id.toString(),
				questionId: question.id.toString(),
				content: "Answer question content",
			},
		});

		expect(questionOnDatabase).toEqual(
			expect.objectContaining({
				content: "Answer question content",
				authorId: user.id.toString(),
				questionId: question.id.toString(),
			}),
		);
	});

	afterAll(async () => {
		await app.close();
	});
});

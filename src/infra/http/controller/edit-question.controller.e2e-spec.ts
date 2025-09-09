import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import request from "supertest";
import { makeModuleRef } from "test/factories/make-module-ref";
import { QuestionFactory } from "test/factories/make-question";
import { StudentFactory } from "test/factories/make-student";
import { PrismaService } from "@/infra/database/prisma/prisma.service";

describe("Edit question (E2E)", () => {
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

	test("[PUT]: /questions/:id", async () => {
		const user = await studentFactory.makePrismaStudent();
		const question = await questionFactory.makePrismaQuestion({
			authorId: user.id,
		});

		const accessToken = jwt.sign({ sub: user.id.toString() });

		const response = await request(app.getHttpServer())
			.put(`/questions/${question.id}`)
			.send({
				title: "question edited",
				content: "Question content edited",
			})
			.set("Authorization", `Bearer ${accessToken}`);

		expect(response.statusCode).toBe(204);

		const questionOnDatabase = await prisma.question.findFirst({
			where: {
				title: "question edited",
			},
		});

		expect(questionOnDatabase).toEqual(
			expect.objectContaining({
				title: "question edited",
				content: "Question content edited",
			}),
		);
	});

	afterAll(async () => {
		await app.close();
	});
});

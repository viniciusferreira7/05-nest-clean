import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import request from "supertest";
import { makeModuleRef } from "test/factories/make-module-ref";
import { StudentFactory } from "test/factories/make-student";

import { PrismaService } from "@/infra/database/prisma/prisma.service";

describe("Create question (E2E)", () => {
	let app: INestApplication;
	let prisma: PrismaService;
	let studentFactory: StudentFactory;
	let jwt: JwtService;

	beforeAll(async () => {
		const moduleRef = await makeModuleRef();

		app = moduleRef.createNestApplication();
		prisma = moduleRef.get(PrismaService);
		studentFactory = moduleRef.get(StudentFactory);
		jwt = moduleRef.get(JwtService);

		await app.init();
	});

	test("[POST]: /questions", async () => {
		const user = await studentFactory.makePrismaStudent();

		const accessToken = jwt.sign({ sub: user.id.toString() });

		const response = await request(app.getHttpServer())
			.post("/questions")
			.send({
				title: "New question",
				content: "Question content",
			})
			.set("Authorization", `Bearer ${accessToken}`);

		expect(response.statusCode).toBe(201);

		const questionOnDatabase = await prisma.question.findFirst({
			where: {
				title: "New question",
			},
		});

		expect(questionOnDatabase).toEqual(
			expect.objectContaining({
				title: "New question",
				content: "Question content",
			}),
		);
	});

	afterAll(async () => {
		await app.close();
	});
});

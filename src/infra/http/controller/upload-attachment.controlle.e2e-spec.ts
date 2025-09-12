import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import request from "supertest";
import { makeModuleRef } from "test/factories/make-module-ref";
import { StudentFactory } from "test/factories/make-student";

describe("Upload attachment (E2E)", () => {
	let app: INestApplication;
	let jwt: JwtService;
	let studentFactory: StudentFactory;

	beforeAll(async () => {
		const moduleRef = await makeModuleRef();

		app = moduleRef.createNestApplication();
		studentFactory = moduleRef.get(StudentFactory);
		jwt = moduleRef.get(JwtService);

		await app.init();
	});

	test("[POST]: /attachments", async () => {
		const user = await studentFactory.makePrismaStudent();

		const accessToken = jwt.sign({ sub: user.id.toString() });

		const response = await request(app.getHttpServer())
			.post("/attachments")
			.set("Authorization", `Bearer ${accessToken}`)
			.attach("file", "./test/e2e/sample-upload.png");

		expect(response.status).toBe(201);
	});

	afterAll(async () => {
		await app.close();
	});
});

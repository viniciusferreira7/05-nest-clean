import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import request from "supertest";
import { AttachmentFactory } from "test/factories/make-attachment";
import { makeModuleRef } from "test/factories/make-module-ref";
import { StudentFactory } from "test/factories/make-student";
import { PrismaService } from "@/infra/database/prisma/prisma.service";

describe("Create question (E2E)", () => {
	let app: INestApplication;
	let prisma: PrismaService;
	let studentFactory: StudentFactory;
	let attachmentFactory: AttachmentFactory;
	let jwt: JwtService;

	beforeAll(async () => {
		const moduleRef = await makeModuleRef();

		app = moduleRef.createNestApplication();
		prisma = moduleRef.get(PrismaService);
		studentFactory = moduleRef.get(StudentFactory);
		attachmentFactory = moduleRef.get(AttachmentFactory);
		jwt = moduleRef.get(JwtService);

		await app.init();
	});

	test("[POST]: /questions", async () => {
		const user = await studentFactory.makePrismaStudent();
		const attachment1 = await attachmentFactory.makePrismaAttachment();
		const attachment2 = await attachmentFactory.makePrismaAttachment();

		const accessToken = jwt.sign({ sub: user.id.toString() });

		const attachmentIds = [
			attachment1.id.toString(),
			attachment2.id.toString(),
		];

		const response = await request(app.getHttpServer())
			.post("/questions")
			.send({
				title: "New question",
				content: "Question content",
				attachments: attachmentIds,
			})
			.set("Authorization", `Bearer ${accessToken}`);

		expect(response.statusCode).toBe(201);

		const questionOnDatabase = await prisma.question.findFirst({
			where: {
				title: "New question",
			},
		});

		const attachmentsOnDatabase = await prisma.attachment.findMany({
			where: {
				id: {
					in: attachmentIds,
				},
				questionId: questionOnDatabase?.id,
			},
		});

		expect(questionOnDatabase).toEqual(
			expect.objectContaining({
				title: "New question",
				content: "Question content",
			}),
		);

		expect(attachmentsOnDatabase).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					title: attachment1.title,
					url: attachment1.url,
				}),
				expect.objectContaining({
					title: attachment2.title,
					url: attachment2.url,
				}),
			]),
		);
	});

	afterAll(async () => {
		await app.close();
	});
});

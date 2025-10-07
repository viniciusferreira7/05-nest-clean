import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import request from "supertest";
import { AttachmentFactory } from "test/factories/make-attachment";
import { makeModuleRef } from "test/factories/make-module-ref";
import { QuestionFactory } from "test/factories/make-question";
import { StudentFactory } from "test/factories/make-student";
import { PrismaService } from "@/infra/database/prisma/prisma.service";

describe("Answer question (E2E)", () => {
	let app: INestApplication;
	let prisma: PrismaService;
	let studentFactory: StudentFactory;
	let questionFactory: QuestionFactory;
	let attachmentFactory: AttachmentFactory;
	let jwt: JwtService;

	beforeAll(async () => {
		const moduleRef = await makeModuleRef();

		app = moduleRef.createNestApplication();
		prisma = moduleRef.get(PrismaService);
		studentFactory = moduleRef.get(StudentFactory);
		questionFactory = moduleRef.get(QuestionFactory);
		attachmentFactory = moduleRef.get(AttachmentFactory);
		jwt = moduleRef.get(JwtService);

		await app.init();
	});

	test("[POST]: /questions/:questionId/answers", async () => {
		const user = await studentFactory.makePrismaStudent();
		const question = await questionFactory.makePrismaQuestion({
			authorId: user.id,
		});

		const accessToken = jwt.sign({ sub: user.id.toString() });

		const [attachment1, attachment2] = await Promise.all([
			attachmentFactory.makePrismaAttachment(),
			attachmentFactory.makePrismaAttachment(),
		]);

		const attachmentIds = [
			attachment1.id.toString(),
			attachment2.id.toString(),
		];

		const response = await request(app.getHttpServer())
			.post(`/questions/${question.id}/answers`)
			.send({
				content: "Answer question content",
				attachments: attachmentIds,
			})
			.set("Authorization", `Bearer ${accessToken}`);

		expect(response.statusCode).toBe(201);

		const answerOnDatabase = await prisma.answer.findFirst({
			where: {
				authorId: user.id.toString(),
				questionId: question.id.toString(),
				content: "Answer question content",
			},
		});

		const attachmentsOnDatabase = await prisma.attachment.findMany({
			where: {
				id: {
					in: attachmentIds,
				},
				answerId: answerOnDatabase?.id,
			},
		});

		expect(answerOnDatabase).toEqual(
			expect.objectContaining({
				content: "Answer question content",
				authorId: user.id.toString(),
				questionId: question.id.toString(),
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

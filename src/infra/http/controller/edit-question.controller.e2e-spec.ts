import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import request from "supertest";
import { AttachmentFactory } from "test/factories/make-attachment";
import { makeModuleRef } from "test/factories/make-module-ref";
import { QuestionFactory } from "test/factories/make-question";
import { QuestionAttachmentFactory } from "test/factories/make-question-attachment";
import { StudentFactory } from "test/factories/make-student";
import { PrismaService } from "@/infra/database/prisma/prisma.service";

describe("Edit question (E2E)", () => {
	let app: INestApplication;
	let prisma: PrismaService;
	let studentFactory: StudentFactory;
	let questionFactory: QuestionFactory;
	let attachmentFactory: AttachmentFactory;
	let questionAttachmentFactory: QuestionAttachmentFactory;
	let jwt: JwtService;

	beforeAll(async () => {
		const moduleRef = await makeModuleRef();

		app = moduleRef.createNestApplication();
		prisma = moduleRef.get(PrismaService);
		studentFactory = moduleRef.get(StudentFactory);
		attachmentFactory = moduleRef.get(AttachmentFactory);
		questionFactory = moduleRef.get(QuestionFactory);
		questionAttachmentFactory = moduleRef.get(QuestionAttachmentFactory);
		jwt = moduleRef.get(JwtService);

		await app.init();
	});

	test("[PUT]: /questions/:id", async () => {
		const user = await studentFactory.makePrismaStudent();

		const [attachment1, attachment2, question] = await Promise.all([
			attachmentFactory.makePrismaAttachment(),
			attachmentFactory.makePrismaAttachment(),
			questionFactory.makePrismaQuestion({
				authorId: user.id,
			}),
		]);

		await Promise.all([
			questionAttachmentFactory.makePrismaQuestionAttachment({
				attachmentId: attachment1.id,
				questionId: question.id,
			}),
			questionAttachmentFactory.makePrismaQuestionAttachment({
				attachmentId: attachment2.id,
				questionId: question.id,
			}),
		]);

		const accessToken = jwt.sign({ sub: user.id.toString() });

		const attachment3 = await attachmentFactory.makePrismaAttachment();

		const attachmentIds = [
			attachment1.id.toString(),
			attachment3.id.toString(),
		];

		const response = await request(app.getHttpServer())
			.put(`/questions/${question.id}`)
			.send({
				title: "question edited",
				content: "Question content edited",
				attachments: attachmentIds,
			})
			.set("Authorization", `Bearer ${accessToken}`);

		expect(response.statusCode).toBe(204);

		const questionOnDatabase = await prisma.question.findFirst({
			where: {
				title: "question edited",
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
				title: "question edited",
				content: "Question content edited",
			}),
		);

		expect(attachmentsOnDatabase).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					title: attachment1.title,
					url: attachment1.url,
				}),
				expect.objectContaining({
					title: attachment3.title,
					url: attachment3.url,
				}),
			]),
		);
	});

	afterAll(async () => {
		await app.close();
	});
});

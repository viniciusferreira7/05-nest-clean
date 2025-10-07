import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import request from "supertest";
import { AnswerFactory } from "test/factories/make-answer";
import { AnswerAttachmentFactory } from "test/factories/make-answer-attachment";
import { AttachmentFactory } from "test/factories/make-attachment";
import { makeModuleRef } from "test/factories/make-module-ref";
import { QuestionFactory } from "test/factories/make-question";
import { StudentFactory } from "test/factories/make-student";
import { PrismaService } from "@/infra/database/prisma/prisma.service";

describe("Edit answer (E2E)", () => {
	let app: INestApplication;
	let prisma: PrismaService;
	let studentFactory: StudentFactory;
	let questionFactory: QuestionFactory;
	let answerFactory: AnswerFactory;
	let attachmentFactory: AttachmentFactory;
	let answerAttachmentFactory: AnswerAttachmentFactory;
	let jwt: JwtService;

	beforeAll(async () => {
		const moduleRef = await makeModuleRef();

		app = moduleRef.createNestApplication();
		prisma = moduleRef.get(PrismaService);
		studentFactory = moduleRef.get(StudentFactory);
		questionFactory = moduleRef.get(QuestionFactory);
		answerFactory = moduleRef.get(AnswerFactory);
		attachmentFactory = moduleRef.get(AttachmentFactory);
		answerAttachmentFactory = moduleRef.get(AnswerAttachmentFactory);
		jwt = moduleRef.get(JwtService);

		await app.init();
	});

	test("[PUT]: /answers/:id", async () => {
		const user = await studentFactory.makePrismaStudent();

		const question = await questionFactory.makePrismaQuestion({
			authorId: user.id,
		});

		const [attachment1, attachment2, answer] = await Promise.all([
			attachmentFactory.makePrismaAttachment(),
			attachmentFactory.makePrismaAttachment(),
			answerFactory.makePrismaAnswer({
				authorId: user.id,
				questionId: question.id,
			}),
		]);

		await Promise.all([
			answerAttachmentFactory.makePrismaAnswerAttachment({
				attachmentId: attachment1.id,
				answerId: answer.id,
			}),
			answerAttachmentFactory.makePrismaAnswerAttachment({
				attachmentId: attachment2.id,
				answerId: answer.id,
			}),
		]);

		const accessToken = jwt.sign({ sub: user.id.toString() });

		const attachment3 = await attachmentFactory.makePrismaAttachment();

		const attachmentIds = [
			attachment1.id.toString(),
			attachment3.id.toString(),
		];

		const response = await request(app.getHttpServer())
			.put(`/answers/${answer.id}`)
			.send({
				content: "Answer content edited",
				attachments: attachmentIds,
			})
			.set("Authorization", `Bearer ${accessToken}`);

		expect(response.statusCode).toBe(204);

		const answerOnDatabase = await prisma.answer.findFirst({
			where: {
				content: "Answer content edited",
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

		expect(answerOnDatabase).toEqual(
			expect.objectContaining({
				content: "Answer content edited",
			}),
		);
	});

	afterAll(async () => {
		await app.close();
	});
});

import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import request from "supertest";
import { AttachmentFactory } from "test/factories/make-attachment";
import { makeModuleRef } from "test/factories/make-module-ref";
import { QuestionFactory } from "test/factories/make-question";
import { QuestionAttachmentFactory } from "test/factories/make-question-attachment";
import { StudentFactory } from "test/factories/make-student";

describe("Get question by slug (E2E)", () => {
	let app: INestApplication;
	let jwt: JwtService;
	let studentFactory: StudentFactory;
	let questionFactory: QuestionFactory;
	let attachmentFactory: AttachmentFactory;
	let questionAttachmentFactory: QuestionAttachmentFactory;

	beforeAll(async () => {
		const moduleRef = await makeModuleRef();

		app = moduleRef.createNestApplication();
		studentFactory = moduleRef.get(StudentFactory);
		jwt = moduleRef.get(JwtService);
		questionFactory = moduleRef.get(QuestionFactory);
		attachmentFactory = moduleRef.get(AttachmentFactory);
		questionAttachmentFactory = moduleRef.get(QuestionAttachmentFactory);

		await app.init();
	});

	test("[GET]: /questions/:slug", async () => {
		const user = await studentFactory.makePrismaStudent({
			name: "John Doe",
		});

		const accessToken = jwt.sign({ sub: user.id.toString() });

		const [, , question] = await Promise.all([
			questionFactory.makePrismaQuestion({ authorId: user?.id }),
			questionFactory.makePrismaQuestion({ authorId: user?.id }),
			questionFactory.makePrismaQuestion({
				title: "New question 3",
				authorId: user?.id,
			}),
		]);

		const attachment = await attachmentFactory.makePrismaAttachment({
			title: "Some attachment",
		});

		await questionAttachmentFactory.makePrismaQuestionAttachment({
			attachmentId: attachment.id,
			questionId: question.id,
		});

		const response = await request(app.getHttpServer())
			.get("/questions/new-question-3")
			.set("Authorization", `Bearer ${accessToken}`);

		expect(response.statusCode).toBe(200);

		expect(response.body).toEqual({
			question: expect.objectContaining({
				title: "New question 3",
				slug: "new-question-3",
				authorName: "John Doe",
				authorId: user?.id.toString(),
				attachments: expect.arrayContaining([
					expect.objectContaining({
						id: attachment.id.toString(),
						url: attachment.url,
						title: attachment.title,
					}),
				]),
			}),
		});
	});

	afterAll(async () => {
		await app.close();
	});
});

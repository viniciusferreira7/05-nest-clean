import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { AttachmentFactory } from "test/factories/make-attachment";
import { makeModuleRef } from "test/factories/make-module-ref";
import { QuestionFactory } from "test/factories/make-question";
import { QuestionAttachmentFactory } from "test/factories/make-question-attachment";
import { StudentFactory } from "test/factories/make-student";
import { QuestionsRepository } from "@/domain/forum/application/repositories/questions-repository";
import { CacheRepository } from "@/infra/cache/cache-repository";
import { PrismaService } from "../prisma.service";

describe("Prisma questions repository (E2E)", () => {
	let app: INestApplication;
	let jwt: JwtService;
	let prisma: PrismaService;
	let studentFactory: StudentFactory;
	let questionFactory: QuestionFactory;
	let attachmentFactory: AttachmentFactory;
	let questionAttachmentFactory: QuestionAttachmentFactory;
	let questionsRepository: QuestionsRepository;
	let cacheRepository: CacheRepository;

	beforeAll(async () => {
		const moduleRef = await makeModuleRef();

		app = moduleRef.createNestApplication();
		studentFactory = moduleRef.get(StudentFactory);
		jwt = moduleRef.get(JwtService);
		prisma = moduleRef.get(PrismaService);
		questionFactory = moduleRef.get(QuestionFactory);
		attachmentFactory = moduleRef.get(AttachmentFactory);
		questionAttachmentFactory = moduleRef.get(QuestionAttachmentFactory);
		questionsRepository = moduleRef.get(QuestionsRepository);
		cacheRepository = moduleRef.get(CacheRepository);

		await app.init();
	});

	it("should cache question details", async () => {
		const user = await studentFactory.makePrismaStudent({
			name: "John Doe",
		});

		const [, , question] = await Promise.all([
			questionFactory.makePrismaQuestion({ authorId: user?.id }),
			questionFactory.makePrismaQuestion({ authorId: user?.id }),
			questionFactory.makePrismaQuestion({
				title: "New question 3",
				authorId: user?.id,
			}),
		]);

		const slug = question.slug;

		await questionsRepository.findDetailsBySlug(slug.value);

		const cacheKey = `question:${slug.value}:details`;

		const cached = await cacheRepository.get(cacheKey);

		const prismaQuestion = await prisma.question.findUnique({
			where: {
				slug: slug.value,
			},
			include: {
				author: true,
				attachments: true,
			},
		});

		expect(cached).toEqual(JSON.stringify(prismaQuestion));
	});

	afterAll(async () => {
		await app.close();
	});
});

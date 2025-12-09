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
				title: "New question 1",
				authorId: user?.id,
			}),
		]);

		const slug = question.slug;

		const questionDetails = await questionsRepository.findDetailsBySlug(
			slug.value,
		);

		const cacheKey = `question:${slug.value}:details`;

		const cached = await cacheRepository.get(cacheKey);

		expect(cached).toEqual(JSON.stringify(questionDetails));
	});

	it("should return cached question details on subsequent calls", async () => {
		const user = await studentFactory.makePrismaStudent({
			name: "John Doe",
		});

		const [, , question] = await Promise.all([
			questionFactory.makePrismaQuestion({ authorId: user?.id }),
			questionFactory.makePrismaQuestion({ authorId: user?.id }),
			questionFactory.makePrismaQuestion({
				title: "New question 2",
				authorId: user?.id,
			}),
		]);

		const slug = question.slug;

		const cacheKey = `question:${slug.value}:details`;
		await cacheRepository.set(cacheKey, JSON.stringify({ empty: true }));

		const questionDetails = await questionsRepository.findDetailsBySlug(
			slug.value,
		);

		expect(questionDetails).toEqual(expect.objectContaining({ empty: true }));
	});

	it("should reset question details cache when saving the question", async () => {
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

		const cacheKey = `question:${slug.value}:details`;
		await cacheRepository.set(cacheKey, JSON.stringify({ empty: true }));

		await questionsRepository.save(question);

		const cached = await cacheRepository.get(cacheKey);

		expect(cached).toBeNull();
	});

	afterAll(async () => {
		await app.close();
	});
});

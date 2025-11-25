import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import request from "supertest";
import { makeModuleRef } from "test/factories/make-module-ref";
import { NotificationFactory } from "test/factories/make-notification";
import { StudentFactory } from "test/factories/make-student";
import { PrismaService } from "@/infra/database/prisma/prisma.service";

describe("Read notification (E2E)", () => {
	let app: INestApplication;
	let jwt: JwtService;
	let prisma: PrismaService;

	let studentFactory: StudentFactory;
	let notificationFactory: NotificationFactory;

	beforeAll(async () => {
		const moduleRef = await makeModuleRef();

		app = moduleRef.createNestApplication();
		prisma = moduleRef.get(PrismaService);

		studentFactory = moduleRef.get(StudentFactory);
		jwt = moduleRef.get(JwtService);
		notificationFactory = moduleRef.get(NotificationFactory);

		await app.init();
	});

	test("[PATCH]: /notifications/:notificationId/read", async () => {
		const user = await studentFactory.makePrismaStudent({
			name: "John Doe",
		});

		const accessToken = jwt.sign({ sub: user.id.toString() });

		const notificationCreated =
			await notificationFactory.makePrismaNotification({
				title: "Notification created",
				recipientId: user.id,
			});

		const response = await request(app.getHttpServer())
			.patch(`/notifications/${notificationCreated.id.toString()}/read`)
			.set("Authorization", `Bearer ${accessToken}`);

		expect(response.statusCode).toBe(204);

		const notificationOnDatabase = await prisma.notification.findUnique({
			where: {
				id: notificationCreated.id.toString(),
			},
		});

		expect(notificationOnDatabase).toEqual(
			expect.objectContaining({
				id: notificationCreated.id.toString(),
				title: "Notification created",
				readAt: expect.any(Date),
			}),
		);
	});

	afterAll(async () => {
		await app.close();
	});
});

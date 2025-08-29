import { FakeHasher } from "test/cryptography/fake-hasher";
import { InMemoryStudentsRepository } from "test/repositories/in-memory-students-repository";

import { StudentAlreadyExistsError } from "./erros/student-already-exists-error";
import { RegisterStudentUseCase } from "./register-student";

let inMemoryStudentsRepository: InMemoryStudentsRepository;
let fakerHasher: FakeHasher;

let sut: RegisterStudentUseCase;

describe("Register student", () => {
	beforeEach(() => {
		inMemoryStudentsRepository = new InMemoryStudentsRepository();
		fakerHasher = new FakeHasher();

		sut = new RegisterStudentUseCase(inMemoryStudentsRepository, fakerHasher);
	});

	it("should be able to register new student", async () => {
		const result = await sut.execute({
			name: "John Doe",
			email: "john.doe@example.com",
			password: "123456",
		});

		expect(result.isRight()).toBe(true);

		expect(result.value).toEqual(
			expect.objectContaining({
				student: inMemoryStudentsRepository.items[0],
			}),
		);
	});

	it("should hash student upon registered", async () => {
		const result = await sut.execute({
			name: "John Doe",
			email: "john.doe@example.com",
			password: "123456",
		});

		expect(result.isRight()).toBe(true);

		const hashedPassword = await fakerHasher.hash("123456");

		expect(result.value).toEqual({
			student: expect.objectContaining({
				password: hashedPassword,
			}),
		});
	});

	it("should not be to register with same credentials twice", async () => {
		await sut.execute({
			name: "John Doe",
			email: "john.doe@example.com",
			password: "123456",
		});

		const result = await sut.execute({
			name: "John Doe",
			email: "john.doe@example.com",
			password: "123456",
		});

		expect(result.isLeft()).toBe(true);
		expect(result.value).instanceOf(StudentAlreadyExistsError);
	});
});

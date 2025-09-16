import { InMemoryAttachmentsRepository } from "test/repositories/in-memory-attachments-repository";
import { FakeUploader } from "test/storage/uploader";
import { InvalidAttachmentTypeError } from "./erros/invalid-attachment-type-error";
import { UploadAndCreateAttachmentUseCase } from "./upload-and-create-attachment";

let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository;
let fakeUploader: FakeUploader;

let sut: UploadAndCreateAttachmentUseCase;

describe("Upload and create attachment", () => {
	inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository();
	fakeUploader = new FakeUploader();

	sut = new UploadAndCreateAttachmentUseCase(
		inMemoryAttachmentsRepository,
		fakeUploader,
	);

	it("should be able to upload and create attachment", async () => {
		const result = await sut.execute({
			fileName: "profile.png",
			fileType: "image/png",
			body: Buffer.from(""),
		});

		expect(result.isRight()).toBe(true);
		expect(result.value).toEqual({
			attachment: expect.objectContaining({
				title: "profile.png",
				url: expect.any(String),
			}),
		});

		expect(fakeUploader.uploads).toHaveLength(1);
		expect(fakeUploader.uploads).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					fileName: "profile.png",
					url: expect.any(String),
				}),
			]),
		);

		expect(inMemoryAttachmentsRepository.items).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					title: "profile.png",
					url: expect.any(String),
				}),
			]),
		);
	});

	it("should not be able to upload and create an attachment with invalid file type", async () => {
		const result = await sut.execute({
			fileName: "profile.gif",
			fileType: "image/gif",
			body: Buffer.from(""),
		});

		expect(result.isLeft()).toBe(true);
		expect(result.value).instanceOf(InvalidAttachmentTypeError);
	});
});

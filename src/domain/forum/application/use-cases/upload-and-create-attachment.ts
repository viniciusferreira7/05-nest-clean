import { Injectable } from "@nestjs/common";
import { type Either, left, right } from "@/core/either";
import { Attachment } from "../../enterprise/entities/attachments";
import { AttachmentsRepository } from "../repositories/attachments-repository";
import { InvalidAttachmentTypeError } from "./erros/invalid-attachment-type-error";

interface UploadAndCreateAttachmentUseCaseRequest {
	fileName: string;
	fileType: string;
	body: Buffer;
}

type UploadAndCreateAttachmentUseCaseResponse = Either<
	InvalidAttachmentTypeError,
	{
		attachment: Attachment;
	}
>;

@Injectable()
export class UploadAndCreateAttachmentUseCase {
	constructor(private readonly attachmentsRepository: AttachmentsRepository) {}

	async execute({
		fileName,
		fileType,
		body,
	}: UploadAndCreateAttachmentUseCaseRequest): Promise<UploadAndCreateAttachmentUseCaseResponse> {
		if (!/^(image\/(jpeg|png))$|^application\/pdf$/.test(fileType)) {
			return left(new InvalidAttachmentTypeError(fileType));
		}

		const attachment = Attachment.create({
			title: fileName,
			url: fileName,
		});

		await this.attachmentsRepository.create(attachment);

		return right({ attachment });
	}
}

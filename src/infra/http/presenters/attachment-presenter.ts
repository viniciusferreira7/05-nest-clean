import type { Attachment } from "@/domain/forum/enterprise/entities/attachments";

export class AttachmentPresenter {
	static toHttp(attachment: Attachment) {
		return {
			id: attachment.id.toString(),
			title: attachment.title,
			url: attachment.title,
		};
	}
}

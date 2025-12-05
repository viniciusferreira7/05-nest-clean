import type { QuestionDetails } from "@/domain/forum/enterprise/entities/value-object/question-details";
import { AttachmentPresenter } from "./attachment-presenter";

export class QuestionDetailsPresenter {
	static toHttp(questionDetails: QuestionDetails) {
		return {
			id: questionDetails.questionId.toString(),
			title: questionDetails.title,
			content: questionDetails.content,
			slug: questionDetails.slug.value,
			authorName: questionDetails.authorName,
			authorId: questionDetails.authorId.toString(),
			bestAnswerId: questionDetails.bestAnswerId?.toString(),
			attachments:
				questionDetails.attachments?.length > 0
					? questionDetails.attachments?.map(AttachmentPresenter.toHttp)
					: [],
			createdAt: questionDetails.createdAt,
			updatedAt: questionDetails.updatedAt,
		};
	}
}

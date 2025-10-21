import type { AnswerWithAuthor } from '@/domain/forum/enterprise/entities/value-object/answer-with-author copy';

export class AnswerWithAuthorPresenter {
	static toHttp(answerWithAuthor: AnswerWithAuthor) {
		return {
			answerId: answerWithAuthor.toString(),
			questionId: answerWithAuthor.questionId.toString(),
			authorId: answerWithAuthor.authorId.toString(),
			authorName: answerWithAuthor.authorName,
			content: answerWithAuthor.content,
			createdAt: answerWithAuthor.createdAt,
			updatedAt: answerWithAuthor.updatedAt,
		};
	}
}

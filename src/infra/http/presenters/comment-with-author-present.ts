import type { CommentWithAuthor } from "@/domain/forum/enterprise/entities/value-object/comment-with-author";

export class CommentWithAuthorPresenter {
	static toHttp(commentWithAuthor: CommentWithAuthor) {
		return {
			commendId: commentWithAuthor.toString(),
			authorId: commentWithAuthor.authorId.toString(),
			authorName: commentWithAuthor.authorName,
			content: commentWithAuthor.content,
			createdAt: commentWithAuthor.createdAt,
			updatedAt: commentWithAuthor.updatedAt,
		};
	}
}

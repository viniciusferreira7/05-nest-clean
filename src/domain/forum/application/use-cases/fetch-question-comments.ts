import { Injectable } from "@nestjs/common";
import { type Either, right } from "@/core/either";
import type { CommentWithAuthor } from "../../enterprise/entities/value-object/comment-with-author";
import { QuestionCommentsRepository } from "../repositories/question-comments-repository";

interface FetchQuestionCommentsUseCaseRequest {
	questionId: string;
	page: number;
}

type FetchQuestionCommentsUseCaseResponse = Either<
	null,
	{
		comments: CommentWithAuthor[];
	}
>;

@Injectable()
export class FetchQuestionCommentsUseCase {
	constructor(private questionCommentRepository: QuestionCommentsRepository) {}

	async execute({
		questionId,
		page,
	}: FetchQuestionCommentsUseCaseRequest): Promise<FetchQuestionCommentsUseCaseResponse> {
		const comments =
			await this.questionCommentRepository.findManyByQuestionIdWithAuthor(
				questionId,
				{
					page,
				},
			);

		return right({ comments: comments });
	}
}

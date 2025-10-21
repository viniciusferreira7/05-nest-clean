import { Injectable } from "@nestjs/common";
import { type Either, right } from "@/core/either";
import type { AnswerWithAuthor } from "../../enterprise/entities/value-object/answer-with-author copy";
import { AnswersRepository } from "../repositories/answers-repository";

interface FetchQuestionAnswersUseCaseRequest {
	questionId: string;
	page: number;
}

type FetchQuestionAnswersUseCaseResponse = Either<
	null,
	{
		answers: AnswerWithAuthor[];
	}
>;

@Injectable()
export class FetchQuestionAnswersUseCase {
	constructor(private answerRepository: AnswersRepository) {}

	async execute({
		questionId,
		page,
	}: FetchQuestionAnswersUseCaseRequest): Promise<FetchQuestionAnswersUseCaseResponse> {
		const answers = await this.answerRepository.findManyByQuestionIdWithAuthor(
			questionId,
			{
				page,
			},
		);

		return right({ answers });
	}
}

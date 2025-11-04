import { Injectable } from "@nestjs/common";

import { Either, left, right } from "@/core/either";
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error";

import type { QuestionDetails } from "../../enterprise/entities/value-object/question-details";
import { QuestionsRepository } from "../repositories/questions-repository";

interface GetQuestionBySlugUseCaseRequest {
	slug: string;
}

type GetQuestionBySlugUseCaseResponse = Either<
	ResourceNotFoundError,
	{
		question: QuestionDetails;
	}
>;

@Injectable()
export class GetQuestionBySlugUseCase {
	constructor(private questionRepository: QuestionsRepository) {}

	async execute({
		slug,
	}: GetQuestionBySlugUseCaseRequest): Promise<GetQuestionBySlugUseCaseResponse> {
		const question = await this.questionRepository.findDetailsBySlug(slug);

		if (!question) {
			return left(new ResourceNotFoundError());
		}

		return right({ question });
	}
}

import type { PaginationParams } from "@/core/repositories/pagination-params";

import type { Answer } from "../../enterprise/entities/answer";
import type { AnswerWithAuthor } from "../../enterprise/entities/value-object/answer-with-author copy";

export abstract class AnswersRepository {
	abstract findById(id: string): Promise<Answer | null>;
	abstract findManyByQuestionId(
		questionId: string,
		params: PaginationParams,
	): Promise<Answer[]>;
	abstract findManyByQuestionIdWithAuthor(
		answerId: string,
		props: PaginationParams,
	): Promise<AnswerWithAuthor[]>;
	abstract save(answer: Answer): Promise<void>;
	abstract create(answer: Answer): Promise<void>;
	abstract delete(answer: Answer): Promise<void>;
}

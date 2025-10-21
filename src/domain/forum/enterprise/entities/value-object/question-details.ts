import type { UniqueEntityId } from "@/core/entities/value-object/unique-entity-id";
import { ValueObject } from "@/core/entities/value-object/value-object";
import type { Attachment } from '../attachments';

export interface QuestionDetailsProps {
  questionId: UniqueEntityId;
  authorId: UniqueEntityId;
  authorName: string;
  title: string
  content: string;
  attachments: Attachment[]
  bestAnswerId?: UniqueEntityId | null
  createdAt: Date;
  updatedAt?: Date | null;
}

export class QuestionDetails extends ValueObject<QuestionDetailsProps> {
  get questionId() {
    return this.props.questionId;
  }
   get authorId() {
    return this.props.authorId;
  }
  get authorName() {
    return this.props.authorName;
  }
  get title() {
    return this.props.title;
  }
  get content() {
    return this.props.content;
  }
  get attachments() {
    return this.props.attachments;
  }
  get bestAnswerId() {
    return this.props?.bestAnswerId;
  }
  get createdAt() {
    return this.props.createdAt;
  }
  get updatedAt() {
    return this.props.updatedAt;
  }

  static create(props: QuestionDetailsProps) {
    return new QuestionDetails(props);
  }
}

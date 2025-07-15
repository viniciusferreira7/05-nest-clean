import { Entity } from '@/core/entities/entity'
import type { UniqueEntityId } from '@/core/entities/value-object/unique-entity-id'
import type { Optional } from '@/core/types/optional'

export interface CommentProps {
  authorId: UniqueEntityId
  content: string
  createdAt: Date
  updatedAt?: Date
}

export class Comment<Props extends CommentProps> extends Entity<Props> {
  get authorId() {
    return this.props.authorId
  }

  get content() {
    return this.props.content
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  set content(content: string) {
    this.props.content = content

    this.touch()
  }

  static create(
    props: Optional<CommentProps, 'createdAt'>,
    id?: UniqueEntityId,
  ) {
    const comment = new Comment(
      { ...props, createdAt: props.createdAt ?? new Date() },
      id,
    )

    return comment
  }
}

import { faker } from '@faker-js/faker'

import { UniqueEntityId } from '@/core/entities/value-object/unique-entity-id'
import {
  Student,
  type StudentProps,
} from '@/domain/forum/enterprise/entities/student'

export function makeStudent(
  override: Partial<StudentProps> = {},
  id?: UniqueEntityId,
) {
  const name = override?.name ?? faker.person.firstName()

  const student = Student.create(
    {
      name,
      email: faker.internet.email({
        firstName: name,
        lastName: faker.person.lastName(),
      }),
      password: faker.internet.password({}),
      ...override,
    },
    id,
  )

  return student
}

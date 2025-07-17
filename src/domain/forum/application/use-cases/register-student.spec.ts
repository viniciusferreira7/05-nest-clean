import { FakeHasher } from 'test/cryptography/fake-hasher'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'

import { RegisterStudentUseCase } from './register-student'

let inMemoryStudentsRepository: InMemoryStudentsRepository
let fakerHasher: FakeHasher

let sut: RegisterStudentUseCase

describe('Register student', () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    fakerHasher = new FakeHasher()

    sut = new RegisterStudentUseCase(inMemoryStudentsRepository, fakerHasher)
  })

  it.skip('should be able to register new student', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: '123456',
    })

    expect(result.isRight()).toEqual(
      expect.objectContaining({
        student: {
          name: 'John Doe',
          email: 'john.doe@example.com',
          password: '123456-hashed',
        },
      }),
    )
  })

  it.skip('should be able to register new student', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: '123456',
    })

    expect(result.isRight()).toEqual(
      expect.objectContaining({
        student: inMemoryStudentsRepository.items[0],
      }),
    )
  })
})

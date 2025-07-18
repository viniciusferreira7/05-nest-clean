import { FakeHasher } from 'test/cryptography/fake-hasher'
import { FakeEncrypter } from 'test/cryptography/faker-encrypter'
import { makeStudent } from 'test/factories/make-student'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'

import { AuthenticateStudentUseCase } from './authenticate-student'
import { WrongCredentialsError } from './erros/wrong-credentials-error'

let inMemoryStudentsRepository: InMemoryStudentsRepository
let fakerHasher: FakeHasher
let fakerEncrypter: FakeEncrypter

let sut: AuthenticateStudentUseCase

describe('Authenticate student', () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    fakerHasher = new FakeHasher()
    fakerEncrypter = new FakeEncrypter()

    sut = new AuthenticateStudentUseCase(
      inMemoryStudentsRepository,
      fakerHasher,
      fakerEncrypter,
    )
  })

  it('should be able to authenticate a student', async () => {
    const student = makeStudent({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: await fakerHasher.hash('123456'),
    })

    await inMemoryStudentsRepository.create(student)

    const result = await sut.execute({
      email: student.email,
      password: '123456',
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      const accessToken = JSON.parse(result.value.accessToken)

      expect(accessToken).toEqual(
        expect.objectContaining({
          sub: student.id.toString(),
        }),
      )
    }
  })

  it('should not able to authenticate with email not registered', async () => {
    const student = makeStudent({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: await fakerHasher.hash('123456'),
    })

    const result = await sut.execute({
      email: student.email,
      password: '123456',
    })

    expect(result.isLeft()).toBe(true)

    if (result.isLeft()) {
      expect(result.value).instanceOf(WrongCredentialsError)
    }
  })

  it('should not able to authenticate with wrong credentials', async () => {
    const student = makeStudent({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: await fakerHasher.hash('123456'),
    })

    const result = await sut.execute({
      email: student.email,
      password: 'wrong-password',
    })

    expect(result.isLeft()).toBe(true)

    if (result.isLeft()) {
      expect(result.value).instanceOf(WrongCredentialsError)
    }
  })
})

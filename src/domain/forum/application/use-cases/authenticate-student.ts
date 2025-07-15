import { Injectable } from '@nestjs/common'

import { type Either, left, right } from '@/core/either'

import type { Encrypter } from '../cryptography/encrypter'
import type { HashCompare } from '../cryptography/hash-compare'
import { StudentsRepository } from '../repositories/students-repository'
import { WrongCredentialsError } from './erros/wrong-credentials-error'

interface AuthenticateStudentUseCaseRequest {
  email: string
  password: string
}

type AuthenticateStudentUseCaseResponse = Either<
  WrongCredentialsError,
  {
    accessToken: string
  }
>

@Injectable()
export class AuthenticateStudentUseCase {
  constructor(
    private readonly studentsRepository: StudentsRepository,
    private readonly hashCompare: HashCompare,
    private readonly encrypter: Encrypter,
  ) {}

  async execute({
    email,
    password,
  }: AuthenticateStudentUseCaseRequest): Promise<AuthenticateStudentUseCaseResponse> {
    const student = await this.studentsRepository.findByEmail(email)

    if (!student) {
      return left(new WrongCredentialsError())
    }

    const doesPasswordMatches = await this.hashCompare.compare(
      password,
      student.password,
    )

    if (!doesPasswordMatches) {
      return left(new WrongCredentialsError())
    }

    const accessToken = await this.encrypter.encrypt({
      sub: student.id.toString(),
    })

    return right({ accessToken })
  }
}

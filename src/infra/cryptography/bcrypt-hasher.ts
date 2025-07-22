import { Injectable } from '@nestjs/common'
import { compare, hash as hashFn } from 'bcryptjs'

import { HashCompare } from '@/domain/forum/application/cryptography/hash-compare'
import { HashGenerator } from '@/domain/forum/application/cryptography/hash-generator'

@Injectable()
export class bcryptHasher implements HashGenerator, HashCompare {
  private readonly HASH_SALT_PASSWORD = 8

  async hash(plain: string): Promise<string> {
    return await hashFn(plain, this.HASH_SALT_PASSWORD)
  }

  async compare(plain: string, hash: string): Promise<boolean> {
    return await compare(plain, hash)
  }
}

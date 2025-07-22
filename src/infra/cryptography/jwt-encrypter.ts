import { Injectable } from '@nestjs/common'
import type { JwtService } from '@nestjs/jwt'

import type { Encrypter } from '@/domain/forum/application/cryptography/encrypter'

@Injectable()
export class JwtEncrypter implements Encrypter {
  constructor(private readonly jwtService: JwtService) {}

  async encrypt(payload: Record<string, unknown>): Promise<string> {
    return this.jwtService.signAsync(payload)
  }
}

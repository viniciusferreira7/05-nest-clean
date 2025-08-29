import { Module } from "@nestjs/common";

import { Encrypter } from "@/domain/forum/application/cryptography/encrypter";
import { HashCompare } from "@/domain/forum/application/cryptography/hash-compare";
import { HashGenerator } from "@/domain/forum/application/cryptography/hash-generator";

import { bcryptHasher } from "./bcrypt-hasher";
import { JwtEncrypter } from "./jwt-encrypter";

@Module({
	providers: [
		{
			provide: Encrypter,
			useClass: JwtEncrypter,
		},
		{ provide: HashGenerator, useClass: bcryptHasher },
		{ provide: HashCompare, useClass: bcryptHasher },
	],
	exports: [Encrypter, HashGenerator, HashCompare],
})
export class cryptographyModule {}

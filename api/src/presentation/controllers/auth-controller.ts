import { SignInUseCase } from '@application/use-cases/auth/sign-in/sign-in-use-case';
import { SignUpUseCase } from '@application/use-cases/auth/sign-up/sign-up-use-case';
import { Body, Controller, Post } from '@nestjs/common';

import { SignInDTO } from '@presentation/dtos/sign-in-dto';
import { SignUpDTO } from '@presentation/dtos/sign-up-dto';

@Controller('/auth')
export class AuthController {
  constructor(
    private readonly signUpUseCase: SignUpUseCase,
    private readonly signInUseCase: SignInUseCase,
  ) {}

  /**
   * Create a new cat
   *
   * @remarks This operation allows you to create a new cat.
   *
   * @throws {401} Invalid credentials.
   */
  @Post('/sign-in')
  signIn(@Body() data: SignInDTO) {
    return this.signInUseCase.execute(data);
  }

  /**
   * Create a new account
   *
   * @remarks This operation allows you to create a new account.
   *
   * @throws {409} User already exists.
   * @throws {422} Invalid data.
   */
  @Post('/sign-up')
  signUp(@Body() data: SignUpDTO) {
    return this.signUpUseCase.execute(data);
  }
}

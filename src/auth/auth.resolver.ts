import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { ResendVerificationDto } from './dto/resend-verification.dto';

@Resolver()
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Mutation(() => String)
  async login(@Args('loginDto') loginDto: LoginDto) {
    const result = await this.authService.login(loginDto);
    return result.access_token;
  }

  @Mutation(() => String)
  async verifyEmail(@Args('verifyEmailDto') verifyEmailDto: VerifyEmailDto) {
    const user = await this.usersService.verifyEmail(verifyEmailDto.token);
    return `Email başarıyla doğrulandı. Hoş geldiniz ${user.firstName}!`;
  }

  @Mutation(() => String)
  async resendVerificationEmail(@Args('resendVerificationDto') resendVerificationDto: ResendVerificationDto) {
    await this.usersService.resendVerificationEmail(resendVerificationDto.email);
    return 'Doğrulama emaili yeniden gönderildi';
  }
}

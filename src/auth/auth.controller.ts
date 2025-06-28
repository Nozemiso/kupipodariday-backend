import { ApiTags } from '@nestjs/swagger';
import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { SigninUserDTO, SigninUserResponseDTO } from './dto/signin-user.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { LocalGuard } from './auth.guard';
import { SignupUserResponseDto } from './dto/signup-user.dto';

@ApiTags('auth')
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalGuard)
  @Post('signin')
  login(@Req() req, @Body() loginDto: SigninUserDTO): SigninUserResponseDTO {
    return this.authService.auth(req.user);
  }

  @Post('signup')
  register(
    @Body() createUserDto: CreateUserDto,
  ): Promise<SignupUserResponseDto> {
    return this.authService.register(createUserDto);
  }
}

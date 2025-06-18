import { Controller, Post, Body, Res, Req, UnauthorizedException, Get, UseGuards } from '@nestjs/common';
import { Response, Request } from "express";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { RegistrationDto } from "./dto/registration.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("/login")
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response
  ) {
    const admin = await this.authService.validateAdmin(
      loginDto.phone,
      loginDto.password
    );
    const { token } = await this.authService.login(admin, response);
    return { access_token: token }; // 🔥 Добавь это!
  }


  @Post("/register")
  async register(@Body() registerDto: RegistrationDto) {
    return this.authService.registration(registerDto);
  }

  @Post("/logout")
  async logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie("access_token");
    return { message: "Logged out" };
  }
  @Post("/validateToken")
  async validateToken(@Req() req: Request): Promise<any> {
    const token = req.cookies?.access_token;
    if (!token) {
      throw new UnauthorizedException('Token not found in cookies');
    }
    return this.authService.validateByToken(token);
  }

}

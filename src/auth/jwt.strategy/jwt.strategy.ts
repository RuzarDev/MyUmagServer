import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from './jwt.interface';
import { AdminService } from "../../admin/admin.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly adminService: AdminService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'yourSecretKey',
      ignoreExpiration: false,
    });
  }

  async validate(payload: JwtPayload) {
    const { id } = payload;
    const admin = await this.adminService.findById(id);
    if (!admin) {
      throw new UnauthorizedException();
    }
    return admin; // Данные администратора будут доступны в запросе
  }
}

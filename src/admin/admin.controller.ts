import {Controller, UseGuards} from '@nestjs/common';
import {JwtAuthGuard} from "../auth/jwt.strategy/jwtAuthGuard";

@Controller('admin')
@UseGuards(JwtAuthGuard)

export class AdminController {

}

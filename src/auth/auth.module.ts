import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminEntity } from '../admin/admin.entity';
import { AdminModule } from '../admin/admin.module';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy/jwt.strategy';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: 'yourSecretKey',
      signOptions: { expiresIn: '1h' },
    }),
    TypeOrmModule.forFeature([AdminEntity]),
    AdminModule,
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [
    AuthService,
    JwtModule,
  ],
})
export class AuthModule {}

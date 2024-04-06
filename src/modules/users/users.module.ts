import 'dotenv/config';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UsersService } from './service/user/users.service';
import { Users } from './users.controller';
import { AuthService } from './service/auth/auth.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      global: true,
      secret: '@*)tsrr%0ik3@tj+5wppr52ie-w$-b#k0@l^1ahxfkmz1()',
      signOptions: { expiresIn: '72h' },
    }),
  ],
  controllers: [Users],
  providers: [UsersService, AuthService],
})
export class UsersModule {}

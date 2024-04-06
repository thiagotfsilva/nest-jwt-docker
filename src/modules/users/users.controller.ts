import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDTO } from './dto/CreateUserDTO.dto';
import { UsersService } from './service/user/users.service';
import { UpdateUserDTO } from './dto/UpdateUserDTO.dto';
import { AuthService } from './service/auth/auth.service';
import { LoginDTO } from './dto/loginDto.dto';
import { AuthGuard } from './service/auth/auth.guard';

@Controller('user')
export class Users {
  constructor(
    private userService: UsersService,
    private authService: AuthService,
  ) {}

  @Post()
  async createUser(@Body() input: CreateUserDTO) {
    return await this.authService.createUser(input);
  }
  @HttpCode(200)
  @Post('login')
  async login(@Body() input: LoginDTO) {
    return await this.authService.signIn(input);
  }

  @Get()
  @UseGuards(AuthGuard)
  async find(@Request() req) {
    const id = req.user.sub;
    return await this.userService.findUser(id);
  }

  @Patch()
  @HttpCode(200)
  @UseGuards(AuthGuard)
  async update(@Request() req, @Body() input: UpdateUserDTO) {
    try {
      const id = req.user.sub;
      await this.userService.updateUser(input, id);
    } catch (error) {
      console.log((error as Error).message);
    }
  }

  @Delete()
  @HttpCode(204)
  @UseGuards(AuthGuard)
  async delete(@Request() req) {
    const id = req.user.sub;
    this.userService.deleteUser(id);
  }
}

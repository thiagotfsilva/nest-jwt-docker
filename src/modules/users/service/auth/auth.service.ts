import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../user.entity';
import { Repository } from 'typeorm';
import { compare, hash } from 'bcrypt';
import { CreateUserDTO } from '../../dto/CreateUserDTO.dto';
import { JwtService } from '@nestjs/jwt';
import { ResCreateUserDto } from '../../dto/ResCreateUserDTO.dto';
import { LoginDTO } from '../../dto/loginDto.dto';
import { UsersService } from '../user/users.service';

@Injectable()
export class AuthService {
  private salt = 12;

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private userService: UsersService,
  ) {}

  async createUser({
    name,
    email,
    description,
    password,
  }: CreateUserDTO): Promise<ResCreateUserDto> {
    const userExist = await this.UserAlreadyExist(email, name);

    if (userExist) {
      throw new UnauthorizedException('Usuário ja existe');
    }

    const user = new User();
    user.name = name;
    user.email = email;
    user.description = description;
    user.password = await this.hashedPassword(password);

    const payLoad = { sub: user.id, userName: user.email };
    const token = await this.jwtService.signAsync(payLoad);
    await this.userRepository.save(user);

    const resCreateUserDTO = new ResCreateUserDto();
    resCreateUserDTO.name = user.name;
    resCreateUserDTO.email = user.email;
    resCreateUserDTO.password = user.password;
    resCreateUserDTO.accessToken = token;

    return resCreateUserDTO;
  }

  async signIn({
    email,
    password,
  }: LoginDTO): Promise<{ acces_token: string }> {
    const user = await this.userService.findUserByEmail(email);
    const isNotMatch = await compare(password, user.password);
    if (user && !isNotMatch) {
      throw new UnauthorizedException();
    }

    const payLoad = { sub: user.id, userName: user.email };
    const token = await this.jwtService.signAsync(payLoad);
    return {
      acces_token: token,
    };
  }

  private async UserAlreadyExist(
    email: string,
    name: string,
  ): Promise<boolean> {
    const userEmail = await this.userRepository.findOneBy({ email });
    const userName = await this.userRepository.findOneBy({ name });
    if (!userEmail && !userName) {
      return false;
    }

    return true;
  }

  private async hashedPassword(password: string): Promise<string> {
    const hashPassword = await hash(password, this.salt);

    if (!hashPassword) {
      throw new BadRequestException('Erro ao tentar criar um novo usuário');
    }

    return hashPassword;
  }
}

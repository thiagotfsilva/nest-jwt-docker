import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../user.entity';
import { UpdateUserDTO } from '../../dto/UpdateUserDTO.dto';
import { ResFindUserDTO } from '../../dto/ResFindUserDTO.dto';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findUser(id: string): Promise<ResFindUserDTO> {
    const user = await this.userRepository.findOne({ where: { id: id } });

    if (!user) {
      throw new BadRequestException('Usuário não encontrado');
    }

    const userRes = new ResFindUserDTO();
    userRes.name = user.name;
    userRes.email = user.email;
    userRes.description = user.description;

    return userRes;
  }

  async findUserByEmail(email: string): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { email: email } });
    if (!user) {
      throw new BadRequestException('Usuário não encontrado');
    }
    return user;
  }

  async updateUser(updateUser: UpdateUserDTO, userId: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    user.name = updateUser.name;
    user.description = updateUser.description;
    await this.userRepository.save(user);
  }

  async deleteUser(userId: string) {
    await this.findUser(userId);
    await this.userRepository.delete(userId);
  }
}

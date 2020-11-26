import { inject, injectable } from 'tsyringe';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import User from '../infra/typeorm/entities/User';
import AppError from '../../../shared/infra/errors/AppError';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

interface IResquest {
  name: string;
  email: string;
  password: string;
}

@injectable()
export default class CreateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({ name, email, password }: IResquest): Promise<User> {
    const verifyEmail = await this.usersRepository.findByEmail(email);

    if (verifyEmail) {
      throw new AppError('An account with this email already exists!');
    }

    const hashedPassword = await this.hashProvider.generateHash(password);

    const user = await this.usersRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    return user;
  }
}

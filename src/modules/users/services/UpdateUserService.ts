import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import { inject, injectable } from 'tsyringe';
import User from '../infra/typeorm/entities/User';
import AppError from '../../../shared/infra/errors/AppError';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

interface IResquest {
  user_id: string;
  name: string;
  email: string;
  password?: string;
  old_password?: string;
}

@injectable()
export default class UpdateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({
    user_id,
    name,
    email,
    password,
    old_password,
  }: IResquest): Promise<User> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError("User doesn't exists");
    }

    const existingEmail = await this.usersRepository.findByEmail(email);

    console.log(user.email);

    if (user.email !== email && existingEmail) {
      throw new AppError('This email already exists');
    }

    user.name = name;
    user.email = email;

    if (password && !old_password) {
      throw new AppError(
        'You should provide your actual password to set a new one',
      );
    }

    if (password && old_password) {
      const checkOldPassword = await this.hashProvider.compare(
        old_password,
        user.password,
      );

      if (!checkOldPassword) {
        throw new AppError('Invalid old password');
      }

      user.password = await this.hashProvider.generateHash(password);
    }

    return this.usersRepository.update(user);
  }
}

import { inject, injectable } from 'tsyringe';
import { isAfter, addHours } from 'date-fns';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import AppError from '../../../shared/infra/errors/AppError';
import IUserTokensRepository from '../repositories/IUserTokensRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

interface IResquest {
  token: string;
  password: string;
}

@injectable()
export default class ResetUserPasswordService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('UserTokensRepository')
    private userTokensRepository: IUserTokensRepository,
    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({ token, password }: IResquest): Promise<void> {
    const userToken = await this.userTokensRepository.findByToken(token);

    if (!userToken) {
      throw new AppError('This token is invalid');
    }

    const user = await this.usersRepository.findById(userToken.user_id);

    if (!user) {
      throw new AppError('This user does not exist');
    }

    const compareDate = addHours(userToken.created_at, 1);

    if (isAfter(Date.now(), compareDate)) {
      throw new AppError('This token is expired');
    }

    user.password = await this.hashProvider.generateHash(password);

    await this.usersRepository.update(user);
  }
}

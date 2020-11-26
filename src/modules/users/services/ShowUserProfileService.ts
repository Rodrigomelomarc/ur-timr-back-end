import { inject, injectable } from 'tsyringe';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import AppError from '../../../shared/infra/errors/AppError';
import User from '../infra/typeorm/entities/User';

interface IResquest {
  user_id: string;
}

@injectable()
export default class ShowUserProfileService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({ user_id }: IResquest): Promise<User> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('This user does not exists');
    }

    return user;
  }
}

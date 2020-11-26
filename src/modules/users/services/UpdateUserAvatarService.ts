import { inject, injectable } from 'tsyringe';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import User from '../infra/typeorm/entities/User';
import AppError from '../../../shared/infra/errors/AppError';
import IStorageProvider from '../../../shared/container/providers/StorageProvider/models/IStorageProvider';

interface IResquest {
  user_id: string;
  fileName: string;
}

@injectable()
export default class UpdateUserAvatarService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('StorageProvider')
    private storageProvider: IStorageProvider,
  ) {}

  public async execute({ user_id, fileName }: IResquest): Promise<User> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError(
        'Only authenticated user is allowed to do this operation',
      );
    }

    if (user.avatar) {
      await this.storageProvider.delete(user.avatar);
    }

    const avatar = await this.storageProvider.save(fileName);

    user.avatar = avatar;

    await this.usersRepository.update(user);

    return user;
  }
}

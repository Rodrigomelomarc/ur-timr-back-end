import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateUserAvatarService from './UpdateUserAvatarService';
import AppError from '../../../shared/infra/errors/AppError';
import FakeStorageProvider from '../../../shared/container/providers/StorageProvider/fakes/FakeStorageProvider';

let usersRepository: FakeUsersRepository;
let storageProvider: FakeStorageProvider;
let updateUserAvatar: UpdateUserAvatarService;

describe('UpdateUserAvatar', () => {
  beforeEach(() => {
    usersRepository = new FakeUsersRepository();
    storageProvider = new FakeStorageProvider();
    updateUserAvatar = new UpdateUserAvatarService(
      usersRepository,
      storageProvider,
    );
  });

  it('should be able to update a avatar from a user', async () => {
    const user = await usersRepository.create({
      name: 'Foo Bar',
      email: 'foobar@example.com',
      password: '123456',
    });

    await updateUserAvatar.execute({
      user_id: user.id,
      fileName: 'avatar_name',
    });

    expect(user.avatar).toEqual('avatar_name');
  });

  it('should not be able to update a avatar from a user with non existing user', async () => {
    await expect(
      updateUserAvatar.execute({
        user_id: 'non-existing-user',
        fileName: 'avatar_name',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update a avatar from a user when it already has a avatar', async () => {
    const user = await usersRepository.create({
      name: 'Foo Bar',
      email: 'foobar@example.com',
      password: '123456',
    });

    await updateUserAvatar.execute({
      user_id: user.id,
      fileName: 'avatar_name',
    });

    await updateUserAvatar.execute({
      user_id: user.id,
      fileName: 'new_avatar_name',
    });

    expect(user.avatar).toEqual('new_avatar_name');
  });
});

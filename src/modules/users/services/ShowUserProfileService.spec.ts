import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import ShowUserProfileService from './ShowUserProfileService';
import AppError from '../../../shared/infra/errors/AppError';

let usersRepository: FakeUsersRepository;
let showUserProfile: ShowUserProfileService;

describe('ShowUserProfile', () => {
  beforeEach(() => {
    usersRepository = new FakeUsersRepository();
    showUserProfile = new ShowUserProfileService(usersRepository);
  });

  it('should be able to show a user', async () => {
    const user = await usersRepository.create({
      name: 'Foo Bar',
      email: 'foobar@example.com',
      password: '123456',
    });

    const returnedUser = await showUserProfile.execute({
      user_id: user.id,
    });

    expect(user.id).toEqual(returnedUser.id);
  });

  it('should not be able to show a non existing user', async () => {
    await expect(
      showUserProfile.execute({
        user_id: 'non-existing-user',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});

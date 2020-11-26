import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import ResetUserPasswordService from './ResetUserPasswordService';
import AppError from '../../../shared/infra/errors/AppError';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import UserToken from '../infra/typeorm/entities/UserToken';

let usersRepository: FakeUsersRepository;
let userTokensRepository: FakeUserTokensRepository;
let hashProvider: FakeHashProvider;
let resetUserPassword: ResetUserPasswordService;

describe('UpdateUserAvatar', () => {
  beforeEach(() => {
    usersRepository = new FakeUsersRepository();
    hashProvider = new FakeHashProvider();
    userTokensRepository = new FakeUserTokensRepository();
    resetUserPassword = new ResetUserPasswordService(
      usersRepository,
      userTokensRepository,
      hashProvider,
    );
  });

  it('should be able to reset a user password', async () => {
    const user = await usersRepository.create({
      name: 'Foo Bar',
      email: 'foobar@example.com',
      password: '123456',
    });

    const { token } = await userTokensRepository.generate(user.id);

    const generateHash = jest.spyOn(hashProvider, 'generateHash');

    await resetUserPassword.execute({
      token,
      password: '1234567',
    });

    expect(generateHash).toBeCalledWith(user.password);
    expect(user.password).toEqual('1234567');
  });

  it('should not be able to reset a password with a non valid token', async () => {
    await expect(
      resetUserPassword.execute({
        token: 'non-valid-token',
        password: '1234567',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to reset a user password to a non valid user', async () => {
    const { token } = await userTokensRepository.generate('non-existing-user');

    await expect(
      resetUserPassword.execute({
        token,
        password: '1234567',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to reset an user password after 1 hour of token generation', async () => {
    const user = await usersRepository.create({
      name: 'Foo Bar',
      email: 'foobar@example.com',
      password: '123456',
    });

    const { token } = await userTokensRepository.generate(user.id);

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      const customDate = new Date();

      return customDate.setHours(customDate.getHours() + 2);
    });

    await expect(
      resetUserPassword.execute({
        token,
        password: '1234567',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});

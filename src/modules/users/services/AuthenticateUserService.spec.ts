import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import AuthenticateUserService from './AuthenticateUserService';
import AppError from '../../../shared/infra/errors/AppError';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

let usersRepository: FakeUsersRepository;
let hashProvider: FakeHashProvider;
let authenticateUser: AuthenticateUserService;

describe('AuthenticateUser', () => {
  beforeEach(() => {
    usersRepository = new FakeUsersRepository();
    hashProvider = new FakeHashProvider();
    authenticateUser = new AuthenticateUserService(
      usersRepository,
      hashProvider,
    );
  });

  it('should be able to authenticate an user', async () => {
    const user = await usersRepository.create({
      name: 'Foo Bar',
      email: 'foobar@example.com',
      password: '123456',
    });

    const response = await authenticateUser.execute({
      email: 'foobar@example.com',
      password: '123456',
    });

    expect(response).toHaveProperty('token');
    expect(response.user).toEqual(user);
  });

  it('should not be able to authenticate user when email is incorrect', async () => {
    await usersRepository.create({
      name: 'Foo Bar',
      email: 'foobar@example.com',
      password: '123456',
    });

    await expect(
      authenticateUser.execute({
        email: 'barfoo@example.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to authenticate user when password is incorrect', async () => {
    await usersRepository.create({
      name: 'Foo Bar',
      email: 'foobar@example.com',
      password: '123456',
    });

    await expect(
      authenticateUser.execute({
        email: 'foobar@example.com',
        password: '12345678',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import CreateuserService from './CreateUserService';
import AppError from '../../../shared/infra/errors/AppError';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

let usersRepository: FakeUsersRepository;
let hashProvider: FakeHashProvider;
let createUser: CreateuserService;

describe('CreateUser', () => {
  beforeEach(() => {
    usersRepository = new FakeUsersRepository();
    hashProvider = new FakeHashProvider();
    createUser = new CreateuserService(usersRepository, hashProvider);
  });

  it('should be able to create a new user', async () => {
    const user = {
      name: 'Foo Bar',
      email: 'foobar@example.com',
      password: '123456',
    };

    const createdUser = await createUser.execute(user);

    expect(createdUser.id).not.toBeNull();
    expect(createdUser.email).toEqual(user.email);
  });

  it('should not be able to create two user with the same email', async () => {
    await usersRepository.create({
      name: 'Foo Bar',
      email: 'foobar@example.com',
      password: '123456',
    });

    await expect(
      createUser.execute({
        name: 'Foo Bar',
        email: 'foobar@example.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});

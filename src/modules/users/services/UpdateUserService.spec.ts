import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateUserService from './UpdateUserService';
import AppError from '../../../shared/infra/errors/AppError';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

let usersRepository: FakeUsersRepository;
let hashProvider: FakeHashProvider;
let updateUser: UpdateUserService;

describe('UpdateUser', () => {
  beforeEach(() => {
    usersRepository = new FakeUsersRepository();
    hashProvider = new FakeHashProvider();
    updateUser = new UpdateUserService(usersRepository, hashProvider);
  });

  it('should be able to update a user', async () => {
    const user = await usersRepository.create({
      name: 'Foo Bar',
      email: 'foobar@example.com',
      password: '123456',
    });

    const updatedUser = await updateUser.execute({
      user_id: user.id,
      name: 'Bar Foo',
      email: 'barfoo@example.com',
    });

    expect(updatedUser.name).toEqual('Bar Foo');
    expect(updatedUser.email).toEqual('barfoo@example.com');
  });

  it('should not be able to update an user when is provided not existing id', async () => {
    await usersRepository.create({
      name: 'Foo Bar',
      email: 'foobar@example.com',
      password: '123456',
    });

    await expect(
      updateUser.execute({
        user_id: 'incorrect_id',
        name: 'Bar Foo',
        email: 'barfoo@example.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update an user when is provided existing email', async () => {
    const user = await usersRepository.create({
      name: 'Foo Bar',
      email: 'foobar@example.com',
      password: '123456',
    });

    await usersRepository.create({
      name: 'Foolano Bar',
      email: 'barfoo@example.com',
      password: '123456',
    });

    await expect(
      updateUser.execute({
        user_id: user.id,
        name: 'Bar Foo',
        email: 'barfoo@example.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update a user password', async () => {
    const user = await usersRepository.create({
      name: 'Foo Bar',
      email: 'foobar@example.com',
      password: '123456',
    });

    const updatedUser = await updateUser.execute({
      user_id: user.id,
      name: 'Bar Foo',
      email: 'barfoo@example.com',
      password: '1234567',
      old_password: '123456',
    });

    expect(updatedUser.password).toEqual('1234567');
  });

  it('should not be able to update an user password when is old password is not provided', async () => {
    const user = await usersRepository.create({
      name: 'Foo Bar',
      email: 'foobar@example.com',
      password: '123456',
    });

    await expect(
      updateUser.execute({
        user_id: user.id,
        name: 'Bar Foo',
        email: 'barfoo@example.com',
        password: '12345657',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update an user password when is provided a wrong old password', async () => {
    const user = await usersRepository.create({
      name: 'Foo Bar',
      email: 'foobar@example.com',
      password: '123456',
    });

    await expect(
      updateUser.execute({
        user_id: user.id,
        name: 'Bar Foo',
        email: 'barfoo@example.com',
        password: '12345657',
        old_password: 'wrong_password',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});

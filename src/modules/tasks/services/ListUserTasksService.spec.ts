import FakeTasksRepository from '../repositories/fakes/FakeTasksRepository';
import FakeUsersRepository from '../../users/repositories/fakes/FakeUsersRepository';
import ListUserTasksService from './ListUserTasksService';
import AppError from '../../../shared/infra/errors/AppError';

let tasksRepository: FakeTasksRepository;
let usersRepository: FakeUsersRepository;
let listUserTaks: ListUserTasksService;

describe('ListUserTasks', () => {
  beforeEach(() => {
    tasksRepository = new FakeTasksRepository();
    usersRepository = new FakeUsersRepository();
    listUserTaks = new ListUserTasksService(tasksRepository, usersRepository);
  });

  it('should be able to list user tasks', async () => {
    const user = await usersRepository.create({
      name: 'Foo Bar',
      email: 'foobar@example.com',
      password: '123456',
    });

    const task = await tasksRepository.create({
      title: 'foobar',
      description: 'foobarbaz',
      user_id: user.id,
    });

    const task2 = await tasksRepository.create({
      title: 'foobar',
      description: 'foobarbaz',
      user_id: user.id,
    });

    const task3 = await tasksRepository.create({
      title: 'foobar',
      description: 'foobarbaz',
      user_id: user.id,
    });

    const task4 = await tasksRepository.create({
      title: 'foobar',
      description: 'foobarbaz',
      user_id: user.id,
    });

    const taskList = await listUserTaks.execute({
      user_id: user.id,
    });

    expect(taskList).toEqual({ tasks: [task, task2, task3, task4], count: 4 });
  });

  it('should not be able to list task from a non existing user', async () => {
    await expect(
      listUserTaks.execute({
        user_id: 'user_id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});

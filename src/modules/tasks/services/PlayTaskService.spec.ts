import FakeTasksRepository from '../repositories/fakes/FakeTasksRepository';
import FakeUsersRepository from '../../users/repositories/fakes/FakeUsersRepository';
import AppError from '../../../shared/infra/errors/AppError';
import PlayTaskService from './PlayTaskService';
import Task from '../infra/typeorm/entities/Task';

let tasksRepository: FakeTasksRepository;
let usersRepository: FakeUsersRepository;
let playTask: PlayTaskService;

describe('PlayTask', () => {
  beforeEach(() => {
    tasksRepository = new FakeTasksRepository();
    usersRepository = new FakeUsersRepository();
    playTask = new PlayTaskService(tasksRepository);
  });

  it('should be able to play task', async () => {
    const user = await usersRepository.create({
      name: 'Foo Bar',
      email: 'foobar@example.com',
      password: '123456',
    });

    const task = await tasksRepository.create({
      title: 'foobar',
      description: 'foobar baz',
      user_id: user.id,
    });

    const playedTask = await playTask.execute({
      user_id: user.id,
      id: task.id,
    });

    expect(playedTask.playing).toBe(true);
  });

  it('should not be able to play a non-existing task', async () => {
    await expect(
      playTask.execute({
        user_id: 'foo-bar',
        id: 'baz',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to play a tasks from a non-owning user', async () => {
    const user = await usersRepository.create({
      name: 'Foo Bar',
      email: 'foobar@example.com',
      password: '123456',
    });

    const user2 = await usersRepository.create({
      name: 'Foo Bar2',
      email: 'foobar2@example.com',
      password: '123456',
    });

    const task = await tasksRepository.create({
      title: 'foobar',
      description: 'foobar baz',
      user_id: user.id,
    });

    await expect(
      playTask.execute({
        user_id: user2.id,
        id: task.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not play a task that is already playing', async () => {
    const user = await usersRepository.create({
      name: 'Foo Bar',
      email: 'foobar@example.com',
      password: '123456',
    });

    const task = await tasksRepository.create({
      title: 'foobar',
      description: 'foobar baz',
      user_id: user.id,
    });

    await playTask.execute({
      user_id: user.id,
      id: task.id,
    });

    await expect(
      playTask.execute({
        user_id: user.id,
        id: task.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to play a finished task', async () => {
    const user = await usersRepository.create({
      name: 'Foo Bar',
      email: 'foobar@example.com',
      password: '123456',
    });

    jest
      .spyOn(tasksRepository, 'findById')
      .mockImplementationOnce(async (id: string) => {
        const task = new Task();

        Object.assign(task, {
          id,
          time_elapsed: 0,
          playing: false,
          finished: true,
          title: 'foo bar',
          description: 'foo bar baz',
          user_id: user.id,
        });

        return task;
      });

    const task = await tasksRepository.create({
      title: 'foobar',
      description: 'foobar baz',
      user_id: user.id,
    });

    await expect(
      playTask.execute({
        user_id: user.id,
        id: task.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});

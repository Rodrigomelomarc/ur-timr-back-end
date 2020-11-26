import FakeTasksRepository from '../repositories/fakes/FakeTasksRepository';
import FakeUsersRepository from '../../users/repositories/fakes/FakeUsersRepository';
import PauseTaskService from './PauseTaskService';
import Task from '../infra/typeorm/entities/Task';
import AppError from '../../../shared/infra/errors/AppError';

let tasksRepository: FakeTasksRepository;
let usersRepository: FakeUsersRepository;
let pauseTask: PauseTaskService;

describe('PauseTask', () => {
  beforeEach(() => {
    tasksRepository = new FakeTasksRepository();
    usersRepository = new FakeUsersRepository();
    pauseTask = new PauseTaskService(tasksRepository);
  });
  it('should be able to pause a task', async () => {
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
          playing: true,
          finisehd: false,
          title: 'foo bar',
          description: 'foo bar baz',
          user_id: user.id,
        });

        return task;
      });

    const task = await pauseTask.execute({
      user_id: user.id,
      id: 'task_id',
      time_elapsed: 60,
    });

    expect(task.playing).toBeFalsy();
    expect(task.time_elapsed).toEqual(60);
  });

  it('should not be able to pause a non existing task', async () => {
    const user = await usersRepository.create({
      name: 'Foo Bar',
      email: 'foobar@example.com',
      password: '123456',
    });

    await expect(
      pauseTask.execute({
        user_id: user.id,
        id: 'task_id',
        time_elapsed: 60,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to pause an task from a non owning user', async () => {
    const user = await usersRepository.create({
      name: 'Foo Bar',
      email: 'foobar@example.com',
      password: '123456',
    });

    const user2 = await usersRepository.create({
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
          playing: true,
          finished: false,
          title: 'foo bar',
          description: 'foo bar baz',
          user_id: user.id,
        });

        return task;
      });

    await expect(
      pauseTask.execute({
        user_id: user2.id,
        id: 'task_id',
        time_elapsed: 60,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to pause an already paused task', async () => {
    const user = await usersRepository.create({
      name: 'Foo Bar',
      email: 'foobar@example.com',
      password: '123456',
    });

    const task = await tasksRepository.create({
      title: 'foo bar',
      description: 'foo bar baz',
      user_id: user.id,
    });

    await expect(
      pauseTask.execute({
        id: task.id,
        user_id: user.id,
        time_elapsed: 60,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to pause a task with less than the previous elapsed time', async () => {
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
          time_elapsed: 60,
          playing: true,
          finished: false,
          title: 'foo bar',
          description: 'foo bar baz',
          user_id: user.id,
        });

        return task;
      });

    await expect(
      pauseTask.execute({
        user_id: user.id,
        id: 'task_id',
        time_elapsed: 40,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});

import FakeTasksRepository from '../repositories/fakes/FakeTasksRepository';
import FakeUsersRepository from '../../users/repositories/fakes/FakeUsersRepository';
import FinishTaskService from './FinishTaskService';
import Task from '../infra/typeorm/entities/Task';
import AppError from '../../../shared/infra/errors/AppError';

let tasksRepository: FakeTasksRepository;
let usersRepository: FakeUsersRepository;
let finishTask: FinishTaskService;

describe('FinishTask', () => {
  beforeEach(() => {
    tasksRepository = new FakeTasksRepository();
    usersRepository = new FakeUsersRepository();
    finishTask = new FinishTaskService(tasksRepository);
  });
  it('should be able to finish a task', async () => {
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
          finisehd: false,
          title: 'foo bar',
          description: 'foo bar baz',
          user_id: user.id,
        });

        return task;
      });

    const task = await finishTask.execute({
      user_id: user.id,
      id: 'task_id',
    });

    expect(task.finished).toBeTruthy();
  });

  it('should not be able to finish a non existing task', async () => {
    const user = await usersRepository.create({
      name: 'Foo Bar',
      email: 'foobar@example.com',
      password: '123456',
    });

    await expect(
      finishTask.execute({
        user_id: user.id,
        id: 'task_id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to finish an task from a non owning user', async () => {
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
          playing: false,
          finished: false,
          title: 'foo bar',
          description: 'foo bar baz',
          user_id: user.id,
        });

        return task;
      });

    await expect(
      finishTask.execute({
        user_id: user2.id,
        id: 'task_id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to finish an currently playing task', async () => {
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
          finished: false,
          title: 'foo bar',
          description: 'foo bar baz',
          user_id: user.id,
        });

        return task;
      });

    await expect(
      finishTask.execute({
        id: 'teste',
        user_id: user.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});

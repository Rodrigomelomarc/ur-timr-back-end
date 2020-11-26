import FakeTasksRepository from '../repositories/fakes/FakeTasksRepository';
import FakeUsersRepository from '../../users/repositories/fakes/FakeUsersRepository';
import CreateTaskService from './CreateTaskService.';
import AppError from '../../../shared/infra/errors/AppError';

let tasksRepository: FakeTasksRepository;
let usersRepository: FakeUsersRepository;
let createTask: CreateTaskService;

describe('CreateTask', () => {
  beforeEach(() => {
    tasksRepository = new FakeTasksRepository();
    usersRepository = new FakeUsersRepository();
    createTask = new CreateTaskService(tasksRepository, usersRepository);
  });

  it('should create a new task', async () => {
    const user = await usersRepository.create({
      name: 'Foo Bar',
      email: 'foobar@example.com',
      password: '123456',
    });

    const task = await createTask.execute({
      title: 'terminar essa api pelo amor de jah',
      description: 'eu tenho que terminar isso aqui meu deus',
      user_id: user.id,
    });

    expect(task.id).not.toBeNull();
    expect(task.time_elapsed).toEqual(0);
  });

  it('should not be able to create a new task from a not existing user', async () => {
    await expect(
      createTask.execute({
        title: 'terminar essa api pelo amor de jah',
        description: 'eu tenho que terminar isso aqui meu deus',
        user_id: 'non-existing-user',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});

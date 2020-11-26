import { injectable, inject } from 'tsyringe';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ITasksRepository from '../repositories/ITasksRepository';
import Task from '../infra/typeorm/entities/Task';
import AppError from '../../../shared/infra/errors/AppError';

interface IRequest {
  title: string;
  description: string;
  user_id: string;
}

@injectable()
export default class CreateTaskService {
  constructor(
    @inject('TasksRepository')
    private tasksRepository: ITasksRepository,
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({
    title,
    description,
    user_id,
  }: IRequest): Promise<Task> {
    const existingUser = await this.usersRepository.findById(user_id);

    if (!existingUser) {
      throw new AppError('This user not exists');
    }

    const task = await this.tasksRepository.create({
      title,
      description,
      user_id,
    });

    return task;
  }
}

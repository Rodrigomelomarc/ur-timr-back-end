import { injectable, inject } from 'tsyringe';
import ITasksRepository from '../repositories/ITasksRepository';
import Task from '../infra/typeorm/entities/Task';
import AppError from '../../../shared/infra/errors/AppError';

interface IRequest {
  id: string;
  user_id: string;
}

@injectable()
export default class FinishTaskService {
  constructor(
    @inject('TasksRepository')
    private tasksRepository: ITasksRepository,
  ) {}

  public async execute({ id, user_id }: IRequest): Promise<Task> {
    const task = await this.tasksRepository.findById(id);

    if (!task) {
      throw new AppError('This task was not found', 404);
    }

    if (user_id !== task.user_id) {
      throw new AppError('This task does not belong to that user');
    }

    if (task.playing) {
      throw new AppError('This task should be paused to be finished');
    }

    task.finished = true;

    return this.tasksRepository.update(task);
  }
}

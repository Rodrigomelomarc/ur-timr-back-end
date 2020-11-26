import { injectable, inject } from 'tsyringe';
import ITasksRepository from '../repositories/ITasksRepository';
import Task from '../infra/typeorm/entities/Task';
import AppError from '../../../shared/infra/errors/AppError';

interface IRequest {
  id: string;
  user_id: string;
  time_elapsed: number;
}

@injectable()
export default class PauseTaskService {
  constructor(
    @inject('TasksRepository')
    private tasksRepository: ITasksRepository,
  ) {}

  public async execute({ id, user_id, time_elapsed }: IRequest): Promise<Task> {
    const task = await this.tasksRepository.findById(id);

    if (!task) {
      throw new AppError('This task was not found', 404);
    }

    if (user_id !== task.user_id) {
      throw new AppError('This task does not belong to that user');
    }

    if (!task.playing) {
      throw new AppError('This task should be played before pause');
    }

    if (task.time_elapsed > time_elapsed) {
      throw new AppError(
        'This is not an DeLorean, so no time travel this time',
      );
    }

    task.playing = false;
    task.time_elapsed = time_elapsed;

    return this.tasksRepository.update(task);
  }
}

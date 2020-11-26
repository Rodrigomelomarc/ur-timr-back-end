import { injectable, inject } from 'tsyringe';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ITasksRepository from '../repositories/ITasksRepository';
import Task from '../infra/typeorm/entities/Task';
import AppError from '../../../shared/infra/errors/AppError';

interface IRequest {
  user_id: string;
}

interface IResponse {
  tasks: Task[];
  count: number;
}

@injectable()
export default class ListUserTasksService {
  constructor(
    @inject('TasksRepository')
    private tasksRepository: ITasksRepository,
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({ user_id }: IRequest): Promise<IResponse> {
    const userExists = await this.usersRepository.findById(user_id);

    if (!userExists) {
      throw new AppError('This user does not exists');
    }

    const list = await this.tasksRepository.findAllByUserId(userExists.id);

    const response = {
      tasks: list[0],
      count: list[1],
    };

    return response;
  }
}

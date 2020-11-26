import ICreateTaskDTO from '@modules/tasks/dtos/ICreateTaskDTO';
import { Repository, EntityRepository, getRepository } from 'typeorm';
import ITasksRepository from '../../../repositories/ITasksRepository';
import Task from '../entities/Task';
import { IFindAllByUserIdDTO } from '../../../dtos/IFindAllByUserIdReturnDTO';

@EntityRepository(Task)
export default class TasksRepository implements ITasksRepository {
  private ormRepository: Repository<Task>;

  constructor() {
    this.ormRepository = getRepository(Task);
  }

  public async create(data: ICreateTaskDTO): Promise<Task> {
    const task = this.ormRepository.create(data);

    await this.ormRepository.save(task);

    return task;
  }

  public async findAllByUserId(
    user_id: string,
    page = 1,
  ): Promise<[Task[], number]> {
    const skip = (page - 1) * 10;

    const tasks = this.ormRepository.findAndCount({
      where: { user_id },
      take: 10,
      skip,
    });

    return tasks;
  }

  public async findById(id: string): Promise<Task | undefined> {
    return this.ormRepository.findOne(id);
  }

  public async update(task: Task): Promise<Task> {
    return this.ormRepository.save(task);
  }
}

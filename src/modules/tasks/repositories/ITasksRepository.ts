import Task from '../infra/typeorm/entities/Task';
import ICreateTaskDTO from '../dtos/ICreateTaskDTO';

export default interface ITasksRepository {
  create(data: ICreateTaskDTO): Promise<Task>;
  findAllByUserId(user_id: string, page?: number): Promise<[Task[], number]>;
  findById(id: string): Promise<Task | undefined>;
  update(user: Task): Promise<Task>;
}

import ICreateTaskDTO from '@modules/tasks/dtos/ICreateTaskDTO';
import { uuid } from 'uuidv4';
import ITasksRepository from '../ITasksRepository';
import Task from '../../infra/typeorm/entities/Task';

export default class FakeTasksRepository implements ITasksRepository {
  private tasks: Task[] = [];

  public async create(data: ICreateTaskDTO): Promise<Task> {
    const task = new Task();

    Object.assign(task, { id: uuid(), time_elapsed: 0 }, data);

    this.tasks.push(task);

    return task;
  }

  public async findAllByUserId(user_id: string): Promise<[Task[], number]> {
    const tasks = this.tasks.filter(task => task.user_id === user_id);

    return [tasks, tasks.length];
  }

  public async findById(id: string): Promise<Task | undefined> {
    return this.tasks.find(task => task.id === id);
  }

  public async update(task: Task): Promise<Task> {
    const taskIndex = this.tasks.findIndex(findTask => findTask.id === task.id);

    this.tasks[taskIndex] = task;

    return task;
  }
}

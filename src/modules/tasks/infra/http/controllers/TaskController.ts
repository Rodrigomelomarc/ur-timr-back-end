import { Request, Response } from 'express';
import { container } from 'tsyringe';
import CreateTaskService from '@modules/tasks/services/CreateTaskService.';
import ListUserTasksService from '../../../services/ListUserTasksService';

class TaskController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { id: user_id } = request.user;

    const listUserTasks = container.resolve(ListUserTasksService);

    const taskList = await listUserTasks.execute({ user_id });

    return response.json(taskList);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const { title, description } = request.body;
    const { id: user_id } = request.user;

    const createTask = container.resolve(CreateTaskService);

    const task = await createTask.execute({
      title,
      description,
      user_id,
    });

    return response.json(task);
  }
}

export default new TaskController();

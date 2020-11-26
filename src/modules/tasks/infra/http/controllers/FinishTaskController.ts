import { Response, Request } from 'express';
import { container } from 'tsyringe';
import FinishTaskService from '../../../services/FinishTaskService';

class FinishTaskController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const { id: user_id } = request.user;

    const finishTask = container.resolve(FinishTaskService);

    const task = await finishTask.execute({
      id,
      user_id,
    });

    return response.json(task);
  }
}

export default new FinishTaskController();

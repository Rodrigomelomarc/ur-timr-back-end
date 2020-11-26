import { Request, Response } from 'express';
import { container } from 'tsyringe';
import PlayTaskService from '../../../services/PlayTaskService';
import PauseTaskService from '../../../services/PauseTaskService';

class TaskTimerController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const { id: user_id } = request.user;

    const playTask = container.resolve(PlayTaskService);

    const task = await playTask.execute({
      id,
      user_id,
    });

    return response.json(task);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const { id: user_id } = request.user;
    const { time_elapsed } = request.body;

    const pauseTask = container.resolve(PauseTaskService);

    const task = await pauseTask.execute({
      id,
      user_id,
      time_elapsed,
    });

    return response.json(task);
  }
}

export default new TaskTimerController();

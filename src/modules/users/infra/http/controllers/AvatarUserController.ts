import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';
import UpdateUserAvatarService from '../../../services/UpdateUserAvatarService';

class AvatarUserController {
  public async update(request: Request, response: Response): Promise<Response> {
    const { id: user_id } = request.user;
    const { filename: fileName } = request.file;

    const updateUserAvatarService = container.resolve(UpdateUserAvatarService);

    const user = await updateUserAvatarService.execute({ user_id, fileName });

    return response.json(classToClass(user));
  }
}

export default new AvatarUserController();

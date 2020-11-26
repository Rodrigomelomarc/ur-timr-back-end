import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';
import CreateUserService from '../../../services/CreateUserService';
import UpdateUserService from '../../../services/UpdateUserService';
import ShowUserProfileService from '../../../services/ShowUserProfileService';

class ProfileControler {
  public async create(request: Request, response: Response): Promise<Response> {
    const { name, email, password } = request.body;

    const createUserService = container.resolve(CreateUserService);

    const user = await createUserService.execute({ name, email, password });

    return response.json(classToClass(user));
  }

  public async show(request: Request, response: Response): Promise<Response> {
    const { id: user_id } = request.user;

    const showUserProfile = container.resolve(ShowUserProfileService);

    const user = await showUserProfile.execute({ user_id });

    return response.json(classToClass(user));
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { id: user_id } = request.user;
    const { name, email, password, old_password } = request.body;

    const updateUserService = container.resolve(UpdateUserService);

    const user = await updateUserService.execute({
      user_id,
      name,
      email,
      password,
      old_password,
    });

    return response.json(classToClass(user));
  }
}

export default new ProfileControler();

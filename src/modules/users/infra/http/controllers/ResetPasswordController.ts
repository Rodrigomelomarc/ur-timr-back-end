import { Request, Response } from 'express';
import { container } from 'tsyringe';
import ResetUserPasswordService from '../../../services/ResetUserPasswordService';

class ResetPasswordController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { token, password } = request.body;

    const resetUserPasswordService = container.resolve(
      ResetUserPasswordService,
    );

    await resetUserPasswordService.execute({ token, password });

    return response.status(204).json();
  }
}

export default new ResetPasswordController();

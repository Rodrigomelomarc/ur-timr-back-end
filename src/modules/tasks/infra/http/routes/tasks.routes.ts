import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';
import authMiddleware from '../../../../users/infra/http/middlewares/authMiddleware';
import TaskController from '../controllers/TaskController';
import TaskTimerController from '../controllers/TaskTimerController';
import FinishTaskController from '../controllers/FinishTaskController';

const tasksRouter = Router();

tasksRouter.get('/me', authMiddleware, TaskController.index);

tasksRouter.post(
  '/',
  authMiddleware,
  celebrate({
    [Segments.BODY]: {
      title: Joi.string().required(),
      description: Joi.string().required(),
    },
  }),
  TaskController.create,
);

tasksRouter.put('/:id/play', authMiddleware, TaskTimerController.create);

tasksRouter.put('/:id/pause', authMiddleware, TaskTimerController.update);

tasksRouter.put('/:id/finish', authMiddleware, FinishTaskController.create);

export default tasksRouter;

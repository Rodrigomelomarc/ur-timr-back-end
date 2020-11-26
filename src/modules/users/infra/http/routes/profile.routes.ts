import { Router } from 'express';
import { Segments, celebrate, Joi } from 'celebrate';
import ProfileController from '../controllers/ProfileController';
import authMiddleware from '../middlewares/authMiddleware';

const profileRoutes = Router();

profileRoutes.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
      password_confirmation: Joi.string().required().valid(Joi.ref('password')),
    },
  }),
  ProfileController.create,
);

profileRoutes.get('/', authMiddleware, ProfileController.show);

profileRoutes.put(
  '/',
  authMiddleware,
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      old_password: Joi.string(),
      password: Joi.string(),
      password_confirmation: Joi.string().valid(Joi.ref('password')),
    },
  }),
  ProfileController.update,
);

export default profileRoutes;

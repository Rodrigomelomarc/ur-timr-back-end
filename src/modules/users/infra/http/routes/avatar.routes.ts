import { Router } from 'express';
import multer from 'multer';

import uploadConfig from '@config/upload';
import authMiddleware from '../middlewares/authMiddleware';
import AvatarUserController from '../controllers/AvatarUserController';

const avatarRoutes = Router();

const upload = multer(uploadConfig.multer);

avatarRoutes.patch(
  '/',
  authMiddleware,
  upload.single('avatar'),
  AvatarUserController.update,
);

export default avatarRoutes;

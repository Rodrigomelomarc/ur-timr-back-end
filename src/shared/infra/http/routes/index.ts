import { Router } from 'express';
import avatarRoutes from '@modules/users/infra/http/routes/avatar.routes';
import passwordRoutes from '@modules/users/infra/http/routes/password.routes';
import profileRoutes from '@modules/users/infra/http/routes/profile.routes';
import sessionsRouter from '@modules/users/infra/http/routes/sessions.routes';
import tasksRouter from '../../../../modules/tasks/infra/http/routes/tasks.routes';

const routes = Router();

routes.use('/avatar', avatarRoutes);
routes.use('/password', passwordRoutes);
routes.use('/profile', profileRoutes);
routes.use('/sessions', sessionsRouter);
routes.use('/tasks', tasksRouter);

export default routes;

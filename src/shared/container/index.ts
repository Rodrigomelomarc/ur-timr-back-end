import { container } from 'tsyringe';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';

import IUserTokensRepository from '../../modules/users/repositories/IUserTokensRepository';
import UserTokensRepository from '../../modules/users/infra/typeorm/repositories/UserTokensRepository';

import ITasksRepository from '../../modules/tasks/repositories/ITasksRepository';
import TasksRepository from '../../modules/tasks/infra/typeorm/repositories/TasksRepository';

import '@modules/users/providers';
import './providers';

container.registerSingleton<IUsersRepository>(
  'UsersRepository',
  UsersRepository,
);

container.registerSingleton<IUserTokensRepository>(
  'UserTokensRepository',
  UserTokensRepository,
);

container.registerSingleton<ITasksRepository>(
  'TasksRepository',
  TasksRepository,
);

import Task from '../infra/typeorm/entities/Task';

export interface IFindAllByUserIdDTO {
  tasks: Task[];
  count: number;
}

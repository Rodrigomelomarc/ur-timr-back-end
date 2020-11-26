import { uuid } from 'uuidv4';
import IUsersRepository from '../IUsersRepository';
import ICreateUserDTo from '../../dtos/ICreateUserDTO';
import User from '../../infra/typeorm/entities/User';

export default class FakeUsersRepository implements IUsersRepository {
  private users: User[] = [];

  public async create(data: ICreateUserDTo): Promise<User> {
    const user = new User();

    Object.assign(user, { id: uuid() }, data);

    this.users.push(user);

    return user;
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    const user = this.users.find(findUser => findUser.email === email);

    return user;
  }

  public async findById(user_id: string): Promise<User | undefined> {
    const user = this.users.find(findUser => findUser.id === user_id);

    return user;
  }

  public async update(user: User): Promise<User> {
    const userIndex = this.users.findIndex(findUser => findUser.id === user.id);

    this.users[userIndex] = user;

    return user;
  }
}

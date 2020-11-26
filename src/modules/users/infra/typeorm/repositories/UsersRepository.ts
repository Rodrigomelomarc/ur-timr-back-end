import { EntityRepository, Repository, getRepository } from 'typeorm';
import IUsersRepository from '../../../repositories/IUsersRepository';
import User from '../entities/User';
import ICreateUserDTo from '../../../dtos/ICreateUserDTO';

@EntityRepository(User)
export default class UsersRepository implements IUsersRepository {
  private ormRepository: Repository<User>;

  constructor() {
    this.ormRepository = getRepository(User);
  }

  public async create(data: ICreateUserDTo): Promise<User> {
    const user = this.ormRepository.create(data);

    await this.ormRepository.save(user);

    return user;
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    return this.ormRepository.findOne({ where: { email } });
  }

  public async findById(user_id: string): Promise<User | undefined> {
    return this.ormRepository.findOne(user_id);
  }

  public async update(user: User): Promise<User> {
    return this.ormRepository.save(user);
  }
}

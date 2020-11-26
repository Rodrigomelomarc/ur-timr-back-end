import { Repository, EntityRepository, getRepository } from 'typeorm';
import IUserTokensRepository from '../../../repositories/IUserTokensRepository';
import UserToken from '../entities/UserToken';

@EntityRepository(UserToken)
export default class UserTokensRepository implements IUserTokensRepository {
  private ormRepository: Repository<UserToken>;

  constructor() {
    this.ormRepository = getRepository(UserToken);
  }

  public async generate(user_id: string): Promise<UserToken> {
    const token = this.ormRepository.create({
      user_id,
    });

    await this.ormRepository.save(token);

    return token;
  }

  public async findByToken(token: string): Promise<UserToken | undefined> {
    const userToken = await this.ormRepository.findOne({ where: { token } });

    return userToken;
  }
}

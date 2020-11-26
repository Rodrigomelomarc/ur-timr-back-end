import { uuid } from 'uuidv4';
import IUserTokensRepository from '../IUserTokensRepository';
import UserToken from '../../infra/typeorm/entities/UserToken';

export default class FakeUserTokensRepository implements IUserTokensRepository {
  private tokens: UserToken[] = [];

  public async generate(user_id: string): Promise<UserToken> {
    const token = new UserToken();

    Object.assign(token, { id: uuid, user_id, created_at: new Date() });

    this.tokens.push(token);

    return token;
  }

  public async findByToken(token: string): Promise<UserToken | undefined> {
    const findToken = this.tokens.find(tokenFind => tokenFind.token === token);

    return findToken;
  }
}

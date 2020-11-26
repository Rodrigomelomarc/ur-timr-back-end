import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import SendForgotPasswordEmailService from './SendForgotPasswordEmailService';
import AppError from '../../../shared/infra/errors/AppError';
import FakeMailProvider from '../../../shared/container/providers/MailProvider/fakes/FakeMailProvider';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';

let usersRepository: FakeUsersRepository;
let mailProvider: FakeMailProvider;
let userTokensRepository: FakeUserTokensRepository;
let sendForgotPasswordEmail: SendForgotPasswordEmailService;

describe('SendForgotPasswordEmail', () => {
  beforeEach(() => {
    usersRepository = new FakeUsersRepository();
    mailProvider = new FakeMailProvider();
    userTokensRepository = new FakeUserTokensRepository();
    sendForgotPasswordEmail = new SendForgotPasswordEmailService(
      usersRepository,
      mailProvider,
      userTokensRepository,
    );
  });

  it('should be able to send a forgot password email', async () => {
    const sendMail = jest.spyOn(mailProvider, 'sendMail');

    await usersRepository.create({
      name: 'Foo Bar',
      email: 'foobar@example.com',
      password: '123456',
    });

    await sendForgotPasswordEmail.execute({
      email: 'foobar@example.com',
    });

    expect(sendMail).toBeCalled();
  });

  it('should not be able to send a forgot password email to a non existing user', async () => {
    await expect(
      sendForgotPasswordEmail.execute({
        email: 'foobar@example.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to generate a new token to password recover', async () => {
    const generateToken = jest.spyOn(userTokensRepository, 'generate');

    const user = await usersRepository.create({
      name: 'Foo Bar',
      email: 'foobar@example.com',
      password: '123456',
    });

    await sendForgotPasswordEmail.execute({
      email: 'foobar@example.com',
    });

    expect(generateToken).toBeCalledWith(user.id);
  });
});

interface IMailConfig {
  driver: 'ethereal';
  defaults: {
    from: {
      name: string;
      email: string;
    };
  };
}

export default {
  driver: process.env.MAIL_DRIVER,
  defaults: {
    from: {
      name: '',
      email: '',
    },
  },
} as IMailConfig;

import IMailTemplateParseDTO from '../dtos/IMailTemplateParseDto';

export default interface IMailTemplateProvider {
  parse(data: IMailTemplateParseDTO): Promise<string>;
}

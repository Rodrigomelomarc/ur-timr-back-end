import IStorageProvider from '../models/IStorageProvider';

export default class FakeStorageProvider implements IStorageProvider {
  private files: string[] = [];

  public async save(fileName: string): Promise<string> {
    this.files.push(fileName);

    return fileName;
  }

  public async delete(fileName: string): Promise<void> {
    const fileIndex = this.files.findIndex(findFile => findFile === fileName);

    delete this.files[fileIndex];
  }
}

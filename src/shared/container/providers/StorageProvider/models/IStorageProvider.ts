export default interface IStorageProvider {
  save(fileName: string): Promise<string>;
  delete(fileName: string): Promise<void>;
}

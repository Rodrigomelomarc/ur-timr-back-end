import fs from 'fs';
import path from 'path';

import uploadConfig from '@config/upload';
import IStorageProvider from '../models/IStorageProvider';

export default class DiskStorageProvider implements IStorageProvider {
  public async save(fileName: string): Promise<string> {
    await fs.promises.rename(
      path.resolve(uploadConfig.tmpFolder, fileName),
      path.resolve(uploadConfig.uploadFolder, fileName),
    );

    return fileName;
  }

  public async delete(fileName: string): Promise<void> {
    const filePath = path.resolve(uploadConfig.uploadFolder, fileName);

    try {
      await fs.promises.stat(filePath);
    } catch {
      return;
    }

    await fs.promises.unlink(filePath);
  }
}

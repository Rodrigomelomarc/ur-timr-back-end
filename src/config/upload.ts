import multer, { StorageEngine } from 'multer';
import path from 'path';
import crypto from 'crypto';

const tmpFolder = path.resolve(__dirname, '..', '..', 'tmp');

interface IUploadConfig {
  driver: 'disk';

  tmpFolder: string;
  uploadFolder: string;

  multer: {
    storage: StorageEngine;
  };

  config: {
    disk: unknown;
    aws: {
      bucket: string;
    };
  };
}

export default {
  driver: process.env.STORAGE_DRIVER,

  tmpFolder,
  uploadFolder: path.resolve(__dirname, '..', '..', 'tmp', 'uploads'),

  multer: {
    storage: multer.diskStorage({
      destination: tmpFolder,
      filename(request, file, callback) {
        const hash = crypto.randomBytes(10).toString('hex');
        const filename = `${hash}-${file.originalname}`;

        callback(null, filename);
      },
    }),
  },

  config: {
    disk: {},
    aws: {
      bucket: '',
    },
  },
} as IUploadConfig;

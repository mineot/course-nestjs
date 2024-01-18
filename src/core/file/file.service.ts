import { Injectable } from '@nestjs/common';
import { writeFile } from 'fs/promises';
import { join } from 'path';

@Injectable()
export class FileService {
  async upload(
    file: Express.Multer.File,
    args: { path?: string; fileName?: string },
  ) {
    const { fileName } = args;
    let { path } = args;

    if (!path) {
      path = join(__dirname, '..', '..', '..', 'storage', 'photos', fileName);
    }

    return await writeFile(path, file.buffer);
  }
}

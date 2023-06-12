/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */
/* eslint-disable no-restricted-syntax */
/* eslint-disable import/prefer-default-export */
import os from 'os';
import path from 'path';
import fs from 'fs/promises';

class Operation {
  constructor() {
    this.currentPath = path.dirname(os.homedir());
  }

  async _resolvePath(userPath) {
    const tempPath = path.resolve(this.currentPath, userPath);
    const verify = await fs.lstat(tempPath);
    if (verify.isDirectory()) this.currentPath = tempPath;
    return this.currentPath;
  }

  async up() {
    await this.cd('..');
  }

  async cd(userPath) {
    await this._resolvePath(userPath);
    console.log('Path from CD or UP', this.currentPath);
    await this.ls();
  }

  async ls() {
    const METHODS = [
      'isBlockDevice',
      'isCharacterDevice',
      'isDirectory',
      'isFIFO',
      'isFile',
      'isSocket',
      'isSymbolicLink',
    ];
    const dirList = await fs.readdir(this.currentPath, { withFileTypes: true });
    const list = dirList.map((file) => {
      const current = { Name: file.name };
      for (const method of METHODS) {
        if (file[method]()) current.Type = method.slice(2);
      }
      return current;
    });
    console.log(`Current directory ${this.currentPath}`);
    console.table(list, ['Name', 'Type']);
  }
}
export { Operation };

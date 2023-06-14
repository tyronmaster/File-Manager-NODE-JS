/* eslint-disable class-methods-use-this */
/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
/* eslint-disable no-constant-condition */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */
/* eslint-disable no-restricted-syntax */
/* eslint-disable import/prefer-default-export */
import os from 'os';
import path from 'path';
import fs from 'fs/promises';
import readline from 'readline/promises';
import { comandValidate, commandParser } from '../commands/helpers.js';

class Core {
  constructor() {
    this.currentPath = path.dirname(os.homedir());
  }

  async _resolvePath(userPath) {
    const tempPath = path.resolve(this.currentPath, userPath);
    const verify = await fs.lstat(tempPath);
    if (verify.isDirectory()) this.currentPath = tempPath;
    return this.currentPath;
  }

  exit() {
    process.exit();
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

  async run() {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: true,
    });
    do {
      const input = await rl.question(`Current directory ${this.currentPath}\n`);
      const [comand, path1, path2] = await commandParser(input);
      // console.log(await commandParser(input));
      // console.log(await comandValidate(comand, path1, path2) === true);
      if (await comandValidate(comand, path1, path2)) {
        try {
          await this[comand](path1, path2);
        } catch (err) {
          console.log('Operation failed');
        }
      } else console.log('Invalid input');
    } while (true);
  }
}

export { Core };

import os from 'os';
import path from 'path';
import fs from 'fs/promises';
import readline from 'readline/promises';
import { comandValidate, commandParser } from '../commands/helpers.js';
import { currentUser } from '../index.js';

class Core {
  constructor() {
    this.currentPath = path.dirname(os.homedir());
    process.chdir(this.currentPath);
  }

  async _resolvePath(userPath) {
    // this.currentPath = path.resolve(this.currentPath, userPath); // it works alone
    const tempPath = path.resolve(this.currentPath, userPath);
    const verify = await fs.lstat(tempPath);
    if (verify.isDirectory()) {
      this.currentPath = tempPath;
      return this.currentPath
    };
    // if (verify.isFile()) return tempPath;
    // process.chdir(this.currentPath);
    // return this.currentPath;
  }

  async _pathToFileCheck(userPath) {
    // const tempPath = path.resolve(this.currentPath, userPath);
    try {
      const verify = await fs.lstat(userPath);
      return verify.isFile();
    } catch (e) {
      return false;
    }
  }

  async _pathToDirCheck(userPath) {
    // const tempPath = path.resolve(this.currentPath, userPath);
    try {
      const verify = await fs.lstat(userPath);
      return verify.isDirectory();
    } catch (e) {
      return false;
    }
  }

  async up() {
    await this.cd('..');
  }

  async cd(userPath) {
    if (userPath.match(/^[a-z]:$/gi)) userPath += '\\';
    await this._resolvePath(userPath);
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
    // console.log(`Current directory ${this.currentPath}`);
    console.table(list, ['Name', 'Type']);
  }

  async cat(param1) {
    let pathToFile = path.resolve(this.currentPath, param1);
    if (await this._pathToFileCheck(pathToFile)) {
      console.log('Reading file ', pathToFile);
      const line = await fs.readFile(pathToFile, 'utf-8');
      console.log(line);
    }
  }

  async add(param1) {
    let pathToFile = path.resolve(this.currentPath, param1);
    if (await this._pathToFileCheck(pathToFile)) {
      console.log(`File ${pathToFile} already exists`);
    } else {
      await fs.writeFile(pathToFile, '', 'utf-8');
      console.log(`File ${pathToFile} successfully created`);
    }
  }

  async run() {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: true,
    });
    // rl.on('SIGINT', () => currentUser.farewell());
    // rl.on('exit', () => currentUser.farewell());
    // rl.on('close', () => currentUser.farewell());
    do {
      const input = await rl.question(`Current directory ${this.currentPath}\n`);
      const [comand, path1, path2] = await commandParser(input);
      // console.log('Comand', comand);
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

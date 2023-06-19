import os from 'os';
import path from 'path';
import fs from 'fs';
import fsPromises from 'fs/promises';
import readline from 'readline/promises';
import { comandValidate, commandParser } from '../commands/helpers.js';
import { currentUser } from '../index.js';

class Core {
  constructor() {
    this.currentPath = path.dirname(os.homedir());
    process.chdir(this.currentPath);
  }

  async _resolvePath(userPath) {
    if (userPath.match(/^[a-z]:$/gi)) userPath += '\\';
    const tempPath = path.resolve(this.currentPath, userPath);
    const verify = await fsPromises.lstat(tempPath);
    if (verify.isDirectory()) {
      this.currentPath = tempPath;
      return this.currentPath
    };
    // if (verify.isFile()) return tempPath;
  }

  async _pathToFileCheck(userPath) {
    try {
      const verify = await fsPromises.lstat(userPath);
      return verify.isFile();
    } catch (e) {
      return false;
    }
  }

  async _pathToDirCheck(userPath) {
    try {
      const verify = await fsPromises.lstat(userPath);
      return verify.isDirectory();
    } catch (e) {
      return false;
    }
  }

  async up() {
    await this.cd('..');
  }

  async cd(userPath) {
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
    const dirList = await fsPromises.readdir(this.currentPath, { withFileTypes: true });
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
      const line = await fsPromises.readFile(pathToFile, 'utf-8');
      console.log(line);
    }
  }

  async add(param1) {
    let pathToFile = path.resolve(this.currentPath, param1);
    if (await this._pathToFileCheck(pathToFile)) {
      console.log(`File ${pathToFile} already exists`);
    } else {
      await fsPromises.writeFile(pathToFile, '', 'utf-8');
      console.log(`File ${pathToFile} successfully created`);
    }
  }

  async rn(param1, param2) {
    let pathToSrc = path.resolve(this.currentPath, param1);
    let pathToDst = path.resolve(this.currentPath, param2);
    if (await this._pathToFileCheck(pathToSrc)) {
      await fsPromises.rename(pathToSrc, pathToDst);
      console.log(`File ${param1} successfully renamed to ${param2}`);
    }
  }

  async cp(param1, param2) {
    let pathToSrc = path.resolve(this.currentPath, param1);
    let pathToDst = path.resolve(this.currentPath, param2);
    console.log(await this._pathToFileCheck(pathToSrc));
    console.log(await this._pathToDirCheck(pathToDst));
    if (await this._pathToFileCheck(pathToSrc) && await this._pathToDirCheck(pathToDst)) {
      const fileName = pathToSrc.slice(pathToSrc.lastIndexOf('\\') + 1);
      const read = fs.createReadStream(pathToSrc);
      const write = fs.createWriteStream(path.resolve(pathToDst, fileName));
      read.pipe(write);
      console.log(`File ${param1} successfully copied to ${this.currentPath}`);
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

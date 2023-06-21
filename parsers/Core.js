import os from 'os';
import path from 'path';
import crypto from 'crypto';
import zlib from 'zlib';
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
    // fix pathes like 'd:' without backslash
    if (userPath.match(/^[a-z]:$/gi)) userPath += '\\';

    const tempPath = path.resolve(this.currentPath, userPath);
    let type = '';
    if (await this._pathToDirCheck(tempPath)) type = 'dir';
    if (await this._pathToFileCheck(tempPath)) type = 'file';
    if (type === '') throw new Error();
    return { path: tempPath, type };
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
    const tempPath = await this._resolvePath(userPath);
    if (tempPath.type === 'dir') this.currentPath = tempPath.path;
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
    console.table(list, ['Name', 'Type']);
  }

  async cat(userPath) {
    let tempPath = await this._resolvePath(userPath);
    if (tempPath.type === 'file') {
      console.log(`Reading file ${tempPath.path}`);
      const line = await fsPromises.readFile(tempPath.path, 'utf-8');
      console.log(line);
    }
  }

  async add(fileName) {
    let pathToFile = path.resolve(this.currentPath, fileName);
    if (await this._pathToFileCheck(pathToFile)) {
      console.log(`File ${pathToFile} already exists`);
    } else {
      await fsPromises.writeFile(pathToFile, '', 'utf-8');
      console.log(`File ${pathToFile} successfully created`);
    }
  }

  async rn(pathToFile, newFileName) {
    const pathToSrc = await this._resolvePath(pathToFile);
    if (pathToSrc.type === 'file') {
      const pathToDst = path.resolve(this.currentPath, newFileName);
      if (await this._pathToFileCheck(pathToDst)) {
        console.log(`File ${newFileName} already exists! Enter another file name`);
      } else {
        await fsPromises.rename(pathToSrc.path, pathToDst);
        console.log(`File ${pathToFile} successfully renamed to ${newFileName}`);
      }
    }
  }

  async cp(srcFilePath, dstDirPath) {
    let pathToSrc = await this._resolvePath(srcFilePath);
    let pathToDst = await this._resolvePath(dstDirPath);
    if (pathToSrc.type === 'file' && pathToDst.type === 'dir') {
      const fileName = pathToSrc.path.slice(pathToSrc.path.lastIndexOf('\\') + 1);
      const read = fs.createReadStream(pathToSrc.path);
      const write = fs.createWriteStream(path.resolve(pathToDst.path, fileName));
      read.pipe(write);
      console.log(`File ${srcFilePath} successfully copied to ${dstDirPath}`);
    }
  }

  async mv(srcFilePath, dstDirPath) {
    let pathToSrc = await this._resolvePath(srcFilePath);
    let pathToDst = await this._resolvePath(dstDirPath);
    if (pathToSrc.type === 'file' && pathToDst.type === 'dir') {
      const fileName = pathToSrc.path.slice(pathToSrc.path.lastIndexOf('\\') + 1);
      const read = fs.createReadStream(pathToSrc.path);
      const write = fs.createWriteStream(path.resolve(pathToDst.path, fileName));
      read.pipe(write);
      await this.rm(pathToSrc.path);
      console.log(`File ${srcFilePath} successfully moved to ${dstDirPath}`);
    }
  }

  async rm(pathToFile) {
    const tempPath = await this._resolvePath(pathToFile);
    if (tempPath.type === 'file') {
      await fsPromises.unlink(tempPath.path);
    }
  }

  os(attr) {
    switch (attr) {
      case '--EOL': {
        const eol = os.EOL;
        console.log(eol);
        if (eol === '\n') console.log(`end of line: \\n`);
        if (eol === '\r\n') console.log(`end of line: \\r\\n`);
        break;
      }
      case '--cpus': {
        console.log(os.cpus());
        break;
      }
      case '--homedir': {
        console.log(`homedir: ${os.homedir()}`);
        break;
      }
      case '--username': {
        console.log(`username: ${os.userInfo().username}`);
        break;
      }
      case '--architecture': {
        console.log(`architecture: ${os.arch()}`);
        break;
      }
    }
  }

  async hash(pathToFile) {
    const tempPath = await this._resolvePath(pathToFile);
    if (tempPath.type === 'file') {
      const hash = crypto.createHash('sha256');
      const readFile = await fsPromises.readFile(tempPath.path);
      let code = hash.update(readFile);
      console.log(`hash: ${code.digest('hex')}`);
    }
  }

  async compress(pathToSrcFile, pathToDstFile) {
    const srcFile = await this._resolvePath(pathToSrcFile);
    const dstFile = path.resolve(this.currentPath, pathToDstFile);
    if (srcFile.type === 'file') {
      const readStream = fs.createReadStream(srcFile.path);
      const writeStream = fs.createWriteStream(dstFile);
      const compressor = zlib.createBrotliCompress();
      readStream.pipe(compressor).pipe(writeStream);
      console.log(`File ${pathToSrcFile} successfully compressed in ${pathToDstFile}`);
    }
  }

  async decompress(pathToSrcFile, pathToDstFile) {
    const srcFile = await this._resolvePath(pathToSrcFile);
    const dstFile = path.resolve(this.currentPath, pathToDstFile);
    if (srcFile.type === 'file') {
      const readStream = fs.createReadStream(srcFile.path);
      const writeStream = fs.createWriteStream(dstFile);
      const decompressor = zlib.createBrotliDecompress();
      readStream.pipe(decompressor).pipe(writeStream);
      console.log(`File ${pathToSrcFile} successfully decompressed in ${pathToDstFile}`);
    }
  }

  exit() {
    process.exit();
  }

  async run() {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: true,
    });
    do {
      const input = await rl.question(`Current directory ${this.currentPath}\n`);
      const [comand, path1, path2] = commandParser(input);
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

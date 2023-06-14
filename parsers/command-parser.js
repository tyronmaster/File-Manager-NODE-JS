/* eslint-disable import/prefer-default-export */
/* eslint-disable no-console */
/* eslint-disable import/no-cycle */
/* eslint-disable import/extensions */
// import path from 'path';
// import os from 'os';
// import { readDir } from '../commands/readdir.js';
import { currentUser } from '../index.js';
// import { up, ls } from '../commands/up.js';
import { Core } from './Core.js';

// let currentPath = path.dirname(process.execPath);
// let currentPath = path.dirname(os.homedir());

const operator = new Core();

async function commandParser(userCommand) {
  const commandArgs = userCommand
    .toString()
    .trim()
    .split(' ');
  const [command, ...args] = commandArgs;

  switch (command) {
    case '.exit': {
      currentUser.farewell();
      break;
    }
    case 'up': {
      // currentPath = up(currentPath);
      // await readDir(currentPath);
      await operator.up();
      break;
    }
    case 'ls': {
      // console.log(currentPath);
      // await readDir(currentPath);
      await operator.ls();
      break;
    }

    case 'cd': {
      let pathFromArgs = args.join(' ');

      // fix bug when entered argument is "d:" without "\"
      if (pathFromArgs.trim().match(/^[a-z]:/gi) && pathFromArgs.length === 2) {
        pathFromArgs += '\\';
      }

      // currentPath = path.resolve(currentPath, pathFromArgs);
      // console.log(currentPath);
      // await readDir(currentPath);
      console.log('Path from arguments ', pathFromArgs);
      await operator.cd(pathFromArgs);
      break;
    }
    default: process.stdout.write('Invalid input \n');
  }
}

export { commandParser };

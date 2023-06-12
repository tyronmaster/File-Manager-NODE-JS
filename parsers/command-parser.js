/* eslint-disable import/prefer-default-export */
/* eslint-disable no-console */
/* eslint-disable import/no-cycle */
/* eslint-disable import/extensions */
import path from 'path';
import { readDir } from '../commands/readdir.js';
import { username } from '../index.js';

let currentPath = path.dirname(process.execPath);

function commandParser(userCommand) {
  const commandArgs = userCommand
    .toString()
    .trim()
    .split(' ');
  const [command, ...args] = commandArgs;

  switch (command) {
    case '.exit': {
      username.farewell();
      break;
    }
    case 'ls': {
      console.log(currentPath);
      readDir(currentPath);
      break;
    }
    case 'cd': {
      // fix bug when entered argument is "d:" without "\"
      let pathFromArgs = args.join(' ');
      if (pathFromArgs.trim().match(/^[a-z]:/gi) && pathFromArgs.length === 2) {
        pathFromArgs += '\\';
      }

      currentPath = path.resolve(currentPath, pathFromArgs);
      readDir(currentPath);
      break;
    }
    default: process.stdout.write('Invalid input \n');
  }
}

export { commandParser };

/* eslint-disable import/no-cycle */
/* eslint-disable import/extensions */
/* eslint-disable import/prefer-default-export */
import path from 'path';
import fs from 'fs/promises';
import { currentUser } from '../index.js';

function fixPath(pathFromArgs) {
  let pathToFix = pathFromArgs;
  // fix bug when entered argument is "d:" without "\"
  if (pathToFix.trim().match(/^[a-z]:/gi) && pathToFix.length === 2) {
    pathToFix += '\\';
  }
  return pathToFix;
}

// async function fixArguments(args, argumentsCount){

// }

async function pathToFile(userPath) {
  const tempPath = path.resolve(userPath);
  const verify = await fs.lstat(tempPath);
  if (verify.isFile()) return true;
  return false;
}

async function pathToDirectory(userPath) {
  const tempPath = path.resolve(userPath);
  const verify = await fs.lstat(tempPath);
  if (verify.isDirectory()) return true;
  return false;
}

function commandParser(userCommand) {
  return userCommand
    .toString()
    .trim()
    .split(' ');
  // const commandArgs = userCommand
  //   .toString()
  //   .trim()
  //   .split(' ');
  // const [command, ...args] = commandArgs;
  // switch (paramsCount) {
  //   case 1: {
  //     let pathFromArgs = args.join(' ');
  //     if (command === 'cd') pathFromArgs = fixPath(pathFromArgs);
  //     return { command, path1: fixPath(pathFromArgs) };
  //   }
  //   case 2: {
  //     return { command, path1: args[0], path2: args[1] };
  //   }
  //   default: {
  //     return { command };
  //   }
  // }
}

async function comandValidate(comand, param1, param2) {
  switch (comand) {
    case '.exit': {
      currentUser.farewell();
      break;
    }
    case 'up': {
      return (!param1 && !param2);
    }
    case 'cd': {
      return (param1.length > 1 && !param2);
    }
    case 'ls': {
      return (!param1 && !param2);
    }
    case 'cat': {
      return (await pathToFile(param1) && !param2);
    }
    case 'add': {
      return (await pathToFile(param1) && !param2);
    }
    case 'rn': {
      return (await pathToFile(param1) && param2.length > 1);
    }
    case 'cp': {
      return (await pathToFile(param1) && pathToDirectory(param2));
    }
    case 'mv': {
      return (await pathToFile(param1) && pathToDirectory(param2));
    }
    case 'rm': {
      return (await pathToFile(param1) && !param2);
    }
    case 'os': {
      const osComands = ['--EOL', '--cpus', '--homedir', '--username', '--architecture'];
      return osComands.includes(param1);
    }
    case 'hash': {
      return (await pathToFile(param1) && !param2);
    }
    case 'compress': {
      return (await pathToFile(param1) && pathToDirectory(param2));
    }
    case 'decompress': {
      return (await pathToFile(param1) && pathToDirectory(param2));
    }
    default: return false;
  }
  return false;
}

export { commandParser, comandValidate };

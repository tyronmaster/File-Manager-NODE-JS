/* eslint-disable no-console */
/* eslint-disable import/prefer-default-export */
/* eslint-disable import/no-cycle */
/* eslint-disable import/extensions */
import process from 'process';
import { User } from './parsers/User.js';
import { commandParser } from './parsers/command-parser.js';

const currentUser = new User();
currentUser.greeting();

process.stdin.on('data', (data) => {
  try {
    commandParser(data);
  } catch (err) {
    console.log('Operation failed ');
  }

  // parse command string
  // execute command function
  // show current directory
  // process.stdout.write(command + '\n');
});

process.on('SIGINT', () => currentUser.farewell());

export { currentUser };

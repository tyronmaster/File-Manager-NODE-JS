/* eslint-disable import/prefer-default-export */
/* eslint-disable import/no-cycle */
/* eslint-disable import/extensions */
import process from 'process';
import { UserName } from './parsers/username-parser.js';
import { commandParser } from './parsers/command-parser.js';

const username = new UserName();
username.greeting();

process.stdin.on('data', (data) => {
  commandParser(data);
  // parse command string
  // execute command function
  // show current directory
  // process.stdout.write(command + '\n');
});

process.on('SIGINT', () => username.farewell());

export { username };

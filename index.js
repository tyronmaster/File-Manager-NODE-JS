import process from 'process';
import { parseUserName, greeting } from './parsers/username-parser.js';

const username = parseUserName();
greeting(username);

process.stdin.on('data', (command) => {
    // parse command string
    // execute command function
    // show current directory
    process.stdout.write(command);
})
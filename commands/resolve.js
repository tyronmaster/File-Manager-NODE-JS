import path from 'path';
import os from 'os';
import { stat } from 'fs';

let currentPath = path.dirname(os.homedir());

function resolvePath(userPath) {
  // currentPath = path.dirname(currentPath);
  // console.log('Join ', currentPath);
  currentPath = path.resolve(currentPath, userPath);
  console.log('Resolved ', currentPath);
  return currentPath;
}

process.stdin.on('data', (data) => {
  console.log('Process ', currentPath);
  currentPath = resolvePath(data.toString());
})
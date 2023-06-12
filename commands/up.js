/* eslint-disable import/prefer-default-export */
import path from 'path';

function up(currentPath) {
  return path.resolve(currentPath, '..');
}
export { up };

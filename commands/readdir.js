/* eslint-disable import/prefer-default-export */
/* eslint-disable no-console */
/* eslint-disable no-restricted-syntax */
import fs from 'fs';

function readDir(path) {
  fs.readdir(path, { withFileTypes: true }, (err, files) => {
    // if (err) console.log('Operation failed ', err);
    const methods = [
      'isBlockDevice',
      'isCharacterDevice',
      'isDirectory',
      'isFIFO',
      'isFile',
      'isSocket',
      'isSymbolicLink',
    ];
    const list = files.map((file) => {
      const cur = { Name: file.name };
      for (const method of methods) {
        if (file[method]()) cur.Type = method.slice(2);
      }
      return cur;
    });
    console.table(list, ['Name', 'Type']);
  });
}

export { readDir };

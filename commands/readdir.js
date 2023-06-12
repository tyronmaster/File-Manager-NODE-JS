/* eslint-disable import/prefer-default-export */
/* eslint-disable no-console */
/* eslint-disable no-restricted-syntax */
import fs from 'fs/promises';

const readDir = async (path) => {
  const dirList = await fs.readdir(path, { withFileTypes: true });
  const methods = [
    'isBlockDevice',
    'isCharacterDevice',
    'isDirectory',
    'isFIFO',
    'isFile',
    'isSocket',
    'isSymbolicLink',
  ];
  const list = dirList.map((file) => {
    const cur = { Name: file.name };
    for (const method of methods) {
      if (file[method]()) cur.Type = method.slice(2);
    }
    return cur;
  });
  console.table(list, ['Name', 'Type']);
};

export { readDir };

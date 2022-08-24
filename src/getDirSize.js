import { resolve } from "path";
import { promises } from "fs";
const { readdir, lstat } = promises;

export default async function getDirSize(directory, cb) {
  const files = await readdir(directory);

  const map = {};

  const total = await files.reduce(async (total, file) => {
    if (cb && typeof cb === "function") cb(file);
    let t = await total;
    const filePath = resolve(directory, file);
    const filestat = await lstat(filePath);
    if (filestat.isDirectory()) {
      const { total: dirSize } = await getDirSize(filePath, cb);
      t += dirSize;
      map[file] = {
        type: 1,
        size: dirSize,
      };
    } else if (filestat.isFile()) {
      map[file] = {
        type: 0,
        size: filestat.size,
      };
      t += filestat.size;
    }
    return t;
  }, Promise.resolve(0));

  return { total, map };
}

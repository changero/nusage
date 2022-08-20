import { resolve } from "path";
import { readdir, lstat } from "fs/promises";
import chalk from "chalk";
import { formatSize, formatPercent, formatTime } from "./utils.js";

const root = process.cwd();

(async function () {
  const start = Date.now();

  const { total, map } = await getDirSize(root);
  console.log(`Total: ${formatSize(total)}    ${chalk.green(root)}`);
  console.log("-".repeat(60));
  const sorted = [...Object.entries(map)].sort(
    ([, { size: sizea }], [, { size: sizeb }]) => sizeb - sizea
  );
  for (let index = 0; index < sorted.length; index++) {
    const [file, { size, type }] = sorted[index];
    const symbol =
      index === 0 ? "┌─" : index === sorted.length - 1 ? "└─" : "├─";
    if (type === 1) {
      console.log(
        chalk.red(`\t${formatSize(size)}\t\t${formatPercent(size, total)}\t`) +
          `${symbol} ${chalk.green(file)}`
      );
    } else {
      console.log(
        `\t${formatSize(size)}\t\t${formatPercent(
          size,
          total
        )}\t${symbol} ${file}`
      );
    }
  }

  console.log(`耗时: ${formatTime(Date.now() - start)}`);
})();

async function getDirSize(directory) {
  const files = await readdir(directory);

  const map = {};

  const total = await files.reduce(async (total, file) => {
    let t = await total;
    const filePath = resolve(directory, file);
    const filestat = await lstat(filePath);
    if (filestat.isDirectory()) {
      const { total: dirSize } = await getDirSize(filePath);
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

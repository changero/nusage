import { resolve } from "path";
import { readdir, lstat } from "fs/promises";
import chalk from "chalk";
import ora from "ora";

import { formatSize, formatPercent, formatTime } from "./utils.js";

const spinner = ora("正在计算...");
const root = process.cwd();

(async function () {
  spinner.start();
  const start = Date.now();

  const { total, map } = await getDirSize(root, (file) => {
    spinner.text = `正在计算...${file}`;
  });
  spinner.stop();
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

  spinner.succeed(`操作完成，耗时: ${formatTime(Date.now() - start)}`);
})();

async function getDirSize(directory, cb) {
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

import chalk from "chalk";
import ora from "ora";
import getDirSize from "./getDirSize";
import { formatSize, formatPercent, formatTime } from "./utils.js";

const spinner = ora("正在计算...");

export default async function (root) {
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
}

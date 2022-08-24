import { resolve } from "path";
import { cwd } from "./env";

export const unit = ["B", "KB", "MB", "GB", "TB", "PB"];
export function formatSize(byte) {
  let unitIndex = 0;
  let value = byte;
  while (~~value >= 2 ** 10) {
    value = value / 2 ** 10;
    unitIndex += 1;
  }
  return value.toFixed(1) + unit[unitIndex];
}

export function formatPercent(value, total) {
  return ((value / total) * 100).toFixed(1) + "%";
}

export const timeunit = [
  {
    unit: "ms",
    up: 1000,
  },
  {
    unit: "s",
    up: 60,
  },
  {
    unit: "min",
    up: 60,
  },
  {
    unit: "h",
    up: 24,
  },
  {
    unit: "d",
    up: Infinity,
  },
];

export function formatTime(time) {
  let index = 0;
  let value = time;
  while (~~(value / timeunit[index].up) > 1) {
    value = value / timeunit[index].up;
    index++;
  }
  return value.toFixed(1) + timeunit[index].unit;
}

export function resolvePath(dir) {
  const target = resolve(cwd, dir);
  return target;
}

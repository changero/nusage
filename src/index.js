import { program } from "commander";
import { resolvePath } from "./utils";
import { cwd } from "./env";
import main from "./main";

program.description("查询指定目录下所有文件/文件夹的占用大小");

program.option("-d, --dictionary <dir>", "查询该目录下的占用情况", cwd);

program.parse();

const { dictionary } = program.opts();
const root = resolvePath(dictionary);
main(root);

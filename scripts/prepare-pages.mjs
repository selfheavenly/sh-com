import { copyFile, mkdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";

const distDir = path.resolve("dist");
const indexPath = path.join(distDir, "index.html");
const notFoundPath = path.join(distDir, "404.html");
const noJekyllPath = path.join(distDir, ".nojekyll");

await stat(indexPath);
await copyFile(indexPath, notFoundPath);
await mkdir(distDir, { recursive: true });
await writeFile(noJekyllPath, "");


import { spawn } from "node:child_process";

function run(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { shell: true, stdio: "inherit" });
    child.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${command} ${args.join(" ")} exited with code ${code}`));
    });
  });
}

console.log("1/3 Fetch hot news...");
await run("pnpm", ["fetch-hot-news"]);

console.log("2/3 Regenerate pages, topics, tutorials, search index and RSS...");
await run("pnpm", ["migrate"]);

console.log("3/3 Build static site...");
await run("pnpm", ["build"]);

console.log("Content update completed. Next: git status, git add, git commit, git push.");

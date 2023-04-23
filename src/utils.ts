import { execSync, spawn, spawnSync } from "child_process";

export function getLocalBranchList(cwd?: string) {
  if (!cwd) {
    return [];
  }
  return execSync("git branch", { cwd })
    .toString()
    .split("\n")
    .map((branch) => branch.trim())
    .filter((branch) => branch !== "");
}

export function getRawName(branchName: string) {
  return branchName.split("]")?.[1];
}

export async function deleteBranch(branchName: string, cwd?: string, force = false) {
  if (!cwd) {
    return Promise.reject();
  }

  return new Promise<void>((resolve, reject) => {
    const child = spawn("git", ["branch", force ? "-D" : "-d", branchName], {
      cwd,
      stdio: "inherit",
    });

    child.on("exit", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`The branch '${branchName}' is not fully merged.`));
      }
    });

    child.on("error", (error) => {
      reject(error);
    });
  });
}

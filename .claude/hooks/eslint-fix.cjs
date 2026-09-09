let data = "";
process.stdin.on("data", (c) => (data += c));
process.stdin.on("end", () => {
  try {
    const input = JSON.parse(data);
    const filePath = (input.tool_input && input.tool_input.file_path) || "";
    const norm = filePath.replace(/\\/g, "/");
    const idx = norm.indexOf("/frontend/src/");
    if (idx === -1 || !/\.(ts|tsx)$/.test(norm)) return;

    const frontendDir = norm.slice(0, idx + "/frontend".length);
    const relFile = norm.slice(idx + "/frontend/".length);
    const { spawnSync } = require("child_process");
    spawnSync("yarn", ["eslint", "--fix", relFile], {
      cwd: frontendDir,
      stdio: "inherit",
      shell: true,
    });
  } catch {
    // ignore malformed input
  }
});

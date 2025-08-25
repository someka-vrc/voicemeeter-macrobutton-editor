

import { serve } from "bun";
import { join } from "path";
import { readFile, writeFile } from "fs/promises";
import readline from "readline";
import { existsSync } from "fs";

const PUBLIC_DIR = join(import.meta.dir, "build");
const PREV_PATH_FILE = "PREV_PATH.txt";

async function promptFilePath(prevPath: string): Promise<string> {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    if (prevPath)
      console.log(`ファイルパスを入力してください。空欄で前回のパスを使用します(${prevPath})`);
    else
      console.log("ファイルパスを入力してください。");

    rl.question("XML Path: ", (answer) => {
      rl.close();
      const trimmed = answer.trim();
      if (!trimmed) {
        if (prevPath) {
          resolve(prevPath);
        } else {
          resolve("");
        }
      } else {
        const unquoted = trimmed.replace(/^"(.+)"$/, "$1");
        resolve(unquoted);
      }
    });
  });
}

async function getAvailablePort(startPort = 3000, maxPort = 3100): Promise<number> {
  const net = await import("net");
  for (let port = startPort; port <= maxPort; port++) {
    const server = net.createServer();
    try {
      await new Promise<void>((resolve, reject) => {
        server.once("error", reject);
        server.listen(port, () => {
          server.close(() => resolve());
        });
      });
      return port;
    } catch {
      // ポート使用中
    }
  }
  throw new Error("空いているポートが見つかりませんでした");
}

async function main() {
  try {
    const prevTargetFile = existsSync(PREV_PATH_FILE)
      ? await Bun.file(PREV_PATH_FILE).text()
      : "";

    const argPath = Bun.argv[2]?.endsWith(".exe") ? "" : Bun.argv[2];
    const targetFile =
      argPath ||
      process.env.MACROBUTTON_FILE ||
      (await promptFilePath(prevTargetFile));

    if (!targetFile || !existsSync(targetFile)) {
      console.error(`ファイルが存在しません: ${targetFile}`);
      process.exit(1);
    }

    console.log(Bun.argv);
    console.log(`target file: ${targetFile}`);

    await Bun.file(PREV_PATH_FILE).write(targetFile);

    const port = await getAvailablePort();
    serve({
      port,
      async fetch(req) {
        const url = new URL(req.url);
        // API: ファイル読み込み
        if (url.pathname === "/api/read" && req.method === "GET") {
          try {
            const data = await readFile(targetFile, "utf-8");
            // ファイル名のみ抽出
            const fileName = targetFile.split(/[/\\]/).pop();
            return new Response(JSON.stringify({ success: true, data, fileName }), { headers: { "Content-Type": "application/json" } });
          } catch (e) {
            return new Response(JSON.stringify({ success: false, error: String(e) }), { status: 500, headers: { "Content-Type": "application/json" } });
          }
        }
        // API: ファイル保存
        if (url.pathname === "/api/save" && req.method === "POST") {
          const { data } = await req.json();
          try {
            await writeFile(targetFile, data, "utf-8");
            return new Response(JSON.stringify({ success: true }), { headers: { "Content-Type": "application/json" } });
          } catch (e) {
            return new Response(JSON.stringify({ success: false, error: String(e) }), { status: 500, headers: { "Content-Type": "application/json" } });
          }
        }
        // 静的ファイル配信
        let filePath = url.pathname === "/" ? "/index.html" : url.pathname;
        try {
          return new Response(Bun.file(join(PUBLIC_DIR, filePath)));
        } catch {
          return new Response("Not found", { status: 404 });
        }
      },
    });

    console.log(`http://localhost:${port}`);
    if (process.platform === "win32") {
      Bun.spawn(["cmd", "/c", `start http://localhost:${port}`]);
    }
    console.log(`Ctrl+C または 閉じるボタンで終了できます。`);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

main();

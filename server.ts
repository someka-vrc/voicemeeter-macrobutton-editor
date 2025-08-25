import { serve } from "bun";
import { join } from "path";
import { readFile, writeFile } from "fs/promises";
import readline from "readline";
import { existsSync } from "fs";

const PUBLIC_DIR = join(process.cwd(), "build");

/** 前回のターゲットパスを記憶するテキストファイル */
const PREV_PATH_FILE = "PREV_PATH.txt";

/** 前回のターゲットファイルのパス */
const PREV_TARGET_FILE = existsSync(PREV_PATH_FILE)
  ? await Bun.file(PREV_PATH_FILE).text()
  : "";

/** ユーザーにターゲットパスを入力させる */
async function promptFilePath(): Promise<string> {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    if (PREV_TARGET_FILE)
      console.log(`ファイルパスを入力してください。空欄で前回のパスを使用します(${PREV_TARGET_FILE})`);
    else
      console.log("ファイルパスを入力してください。");

    rl.question("XML Path: ", (answer) => {
      rl.close();
      const trimmed = answer.trim();
      if (!trimmed) {
        if (PREV_TARGET_FILE) {
          resolve(PREV_TARGET_FILE);
          return;
        } else {
          console.error("ファイルパスが指定されませんでした。終了します。");
          process.exit(1);
        }
      }
      // 両端のダブルクォートを除去
      const unquoted = trimmed.replace(/^"(.+)"$/, "$1");
      resolve(unquoted);
    });
  });
}

// 空いているポートを自動で選択する関数
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


// 引数・環境変数・ユーザー入力でターゲットパスを取得
/*
  PS voicemeeter-macrobutton-editor> .\foo.exe
  [ "bun", "B:/~BUN/root/foo.exe", "D:\\develop\\workspace\\voicemeeter-macrobutton-editor\\foo.exe" ]
  ファイルが存在しません: 
  PS voicemeeter-macrobutton-editor> .\foo.exe ss
  [ "bun", "B:/~BUN/root/foo.exe", "ss" ]
  ファイルが存在しません: ss
*/
const TARGET_FILE = (Bun.argv[2]?.endsWith(".exe") ? "" : Bun.argv[2])
  || process.env.MACROBUTTON_FILE
  || await promptFilePath();
console.log(Bun.argv);

// なければ終了
if (!existsSync(TARGET_FILE)) {
  console.error(`ファイルが存在しません: ${TARGET_FILE}`);
  process.exit(1);
}

console.log(`target file: ${TARGET_FILE}`);

// 次回実行のためにファイルパスを記憶
await Bun.file(PREV_PATH_FILE).write(TARGET_FILE);

(async () => {
  const port = await getAvailablePort();
  serve({
    port,
  async fetch(req) {
    const url = new URL(req.url);
    // API: ファイル読み込み
    if (url.pathname === "/api/read" && req.method === "GET") {
      try {
        const data = await readFile(TARGET_FILE, "utf-8");
        // ファイル名のみ抽出
        const fileName = TARGET_FILE.split(/[/\\]/).pop();
        return new Response(JSON.stringify({ success: true, data, fileName }), { headers: { "Content-Type": "application/json" } });
      } catch (e) {
        return new Response(JSON.stringify({ success: false, error: String(e) }), { status: 500, headers: { "Content-Type": "application/json" } });
      }
    }
    // API: ファイル保存
    if (url.pathname === "/api/save" && req.method === "POST") {
      const { data } = await req.json();
      try {
        await writeFile(TARGET_FILE, data, "utf-8");
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
  // Windows環境ならサーバー起動時に自動でブラウザを開く
  if (process.platform === "win32") {
    Bun.spawn(["cmd", "/c", `start http://localhost:${port}`]);
  }
  console.log(`Ctrl+C または 閉じるボタンで終了できます。`);
})();

import { useState, useEffect } from "react";
import { XMLParser } from "fast-xml-parser";
import { parseMacroButtons, generateXmlFromItems } from "../utils/xmlUtils";
import { MacroButtonConfiguration, MacroButtonConfigMeta } from "../types/macroButton";

export function useMacroButtonData() {
  const [items, setItems] = useState<MacroButtonConfiguration[]>([]);
  const [fileName, setFileName] = useState<string>("");
  const [configMeta, setConfigMeta] = useState<MacroButtonConfigMeta>({
    "@_x0": "0",
    "@_y0": "0",
    "@_dx": "796",
    "@_dy": "212",
  });

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/read", { method: "GET" });
      const json = await res.json();
      if (json.success) {
        const parser = new XMLParser({
          ignoreAttributes: false,
          attributeNamePrefix: "@_",
        });
        const parsed = parser.parse(json.data);
        const config =
          parsed?.VBAudioVoicemeeterMacroButtonMap?.MacroButtonConfiguration;
        const list = parseMacroButtons(json.data);
        setItems(list);
        setFileName(json.fileName || "(サーバー指定ファイル)");
        setConfigMeta({
          "@_x0": config?.["@_x0"] ?? "0",
          "@_y0": config?.["@_y0"] ?? "0",
          "@_dx": config?.["@_dx"] ?? "796",
          "@_dy": config?.["@_dy"] ?? "212",
        });
      } else {
        alert("ファイル読み込み失敗: " + json.error);
      }
    })();
  }, []);

  const handleSave = async () => {
    try {
      const xml = generateXmlFromItems(items, configMeta);
      const res = await fetch("/api/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: xml }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (json.success) {
        alert("保存しました");
      } else {
        alert("保存失敗: " + json.error);
      }
    } catch (e: any) {
      alert("保存時にエラー: " + (e?.message ?? e));
    }
  };

  return {
    items,
    setItems,
    fileName,
    configMeta,
    setConfigMeta,
    handleSave,
  };
}

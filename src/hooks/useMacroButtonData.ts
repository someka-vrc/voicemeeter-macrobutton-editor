import { useState, useEffect } from "react";
import { parseMacroButtons, generateXmlFromItems } from "../utils/xmlUtils";
import { MacroButtonElement, VBAudioVoicemeeterMacroButtonMap } from "../types/macroButtonXml";
import { defaultXmlRoot } from "../defaults";

export function useMacroButtonData() {
  const [items, setItems] = useState<MacroButtonElement[]>([]);
  const [fileName, setFileName] = useState<string>("");
  const [xmlRoot, setXmlRoot] =
    useState<VBAudioVoicemeeterMacroButtonMap>(defaultXmlRoot);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/read", { method: "GET" });
      const json = await res.json();
      if (json.success) {
        const { root, elements: list } = parseMacroButtons(json.data);
        setItems(list);
        setXmlRoot(root);
        setFileName(json.fileName || "(サーバー指定ファイル)");
      } else {
        alert("ファイル読み込み失敗: " + json.error);
      }
    })();
  }, []);

  const handleSave = async () => {
    try {
      const xml = generateXmlFromItems(items, xmlRoot);
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
    setXmlRoot,
    handleSave,
  };
}

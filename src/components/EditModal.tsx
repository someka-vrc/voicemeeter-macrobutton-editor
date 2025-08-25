import React, { useState, useEffect } from "react";
import { MacroButtonElement } from "../types/macroButtonXml";

interface EditModalProps {
  open: boolean;
  item: MacroButtonElement | null;
  onOk: (values: Partial<MacroButtonElement>) => void;
  onCancel: () => void;
}

const EditModal: React.FC<EditModalProps> = ({ open, item, onOk, onCancel }) => {
  const [values, setValues] = useState<Partial<MacroButtonElement>>({});
  useEffect(() => {
    if (item) {
      setValues({
        MB_Name: item.MB_Name,
        MB_Subname: item.MB_Subname,
        MB_InitRequest: item.MB_InitRequest,
        MB_OnRequest: item.MB_OnRequest,
        MB_OffRequest: item.MB_OffRequest,
        "@_type": item["@_type"] ?? "0",
      });
    }
  }, [item]);

  // Escキーでモーダルを閉じる
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onCancel();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onCancel]);
  if (!open || !item) return null;
  return (
    <div style={{
      position: "fixed", left: 0, top: 0, width: "100vw", height: "100vh", background: "#0008", zIndex: 1000,
      display: "flex", alignItems: "center", justifyContent: "center"
    }}>
      <div
        style={{
          background: "#fff",
          borderRadius: 10,
          minWidth: 510,
          maxWidth: 600,
          width: "100%",
          boxShadow: "0 4px 24px #0003",
          padding: 10,
          display: "flex",
          flexDirection: "column",
          maxHeight: "80vh",
        }}
      >
        <div
          style={{
            padding: 24,
            paddingBottom: 36,
            display: "flex",
            flexDirection: "column",
            gap: 18,
            overflowY: "auto",
            maxHeight: "80vh",
            borderRadius: 10,
            boxSizing: "border-box"
          }}
        >
          <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 8 }}>ボタン編集</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "flex-end" }}>
              <label style={{ fontWeight: 600, fontSize: 14, flex: 1, display: "flex", flexDirection: "column" }}>Button Name:
                <input type="text" value={values.MB_Name ?? ""} onChange={e => setValues(v => ({ ...v, MB_Name: e.target.value }))} style={{ width: "100%", fontSize: 15, marginTop: 2, padding: 4 }} />
              </label>
              <label style={{ fontWeight: 600, fontSize: 14, minWidth: 140, display: "flex", flexDirection: "column", marginLeft: 24 }}>Button Type:
                <select
                  value={values["@_type"] ?? "0"}
                  onChange={e => setValues(v => ({ ...v, "@_type": e.target.value }))}
                  style={{ fontSize: 15, padding: "4px 8px", marginTop: 2 }}
                >
                  <option value="0">Push Button</option>
                  <option value="1">2 Positions</option>
                </select>
              </label>
            </div>
            <label style={{ fontWeight: 600, fontSize: 14 }}>Button Sub Name:
              <input type="text" value={values.MB_Subname ?? ""} onChange={e => setValues(v => ({ ...v, MB_Subname: e.target.value }))} style={{ width: "100%", fontSize: 15, marginTop: 2, padding: 4 }} />
            </label>
            <label style={{ fontWeight: 600, fontSize: 14 }}>Request For Initial State:
              <textarea value={values.MB_InitRequest ?? ""} onChange={e => setValues(v => ({ ...v, MB_InitRequest: e.target.value }))} style={{ width: "100%", fontSize: 15, marginTop: 2, padding: 4, minHeight: 48 }} />
            </label>
            <label style={{ fontWeight: 600, fontSize: 14 }}>Request for Button ON / Trigger IN:
              <textarea value={values.MB_OnRequest ?? ""} onChange={e => setValues(v => ({ ...v, MB_OnRequest: e.target.value }))} style={{ width: "100%", fontSize: 15, marginTop: 2, padding: 4, minHeight: 48 }} />
            </label>
            <label style={{ fontWeight: 600, fontSize: 14 }}>Request for Button OFF / Trigger OUT:
              <textarea value={values.MB_OffRequest ?? ""} onChange={e => setValues(v => ({ ...v, MB_OffRequest: e.target.value }))} style={{ width: "100%", fontSize: 15, marginTop: 2, padding: 4, minHeight: 48 }} />
            </label>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 8 }}>
            <button onClick={() => onCancel()} style={{ padding: "6px 18px", fontSize: 15, borderRadius: 6, border: "1px solid #bbb", background: "#eee", color: "#333", cursor: "pointer" }}>Cancel</button>
            <button onClick={() => onOk(values)} style={{ padding: "6px 18px", fontSize: 15, borderRadius: 6, border: "none", background: "#3b82f6", color: "#fff", fontWeight: 600, cursor: "pointer" }}>OK</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditModal;

import React, { useState } from "react";
import { MacroButtonElement } from "./types/macroButtonXml";
import EditModal from "./components/EditModal";
import SortableItem from "./components/SortableItem";
import Header from "./components/Header";
import Footer from "./components/Footer";
import FileNameBar from "./components/FileNameBar";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import { useMacroButtonData } from "./hooks/useMacroButtonData";
import { useMacroButtonDnD } from "./hooks/useMacroButtonDnD";
import { defaultMacroButton } from "./defaults";
import { MACROBUTTON_MAX, GRID_COLUMNS, GRID_GAP, GRID_MAX_WIDTH } from "./constants";
import { v4 as uuidv4 } from "uuid";


const mainStyle: React.CSSProperties = {
  flex: 1,
  overflow: "auto",
  background: "#f7f7fa",
  padding: "2rem 1rem 2rem 1rem",
  minHeight: 0,
};

const gridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: `repeat(${GRID_COLUMNS}, 1fr)`,
  gap: GRID_GAP,
  maxWidth: GRID_MAX_WIDTH,
  margin: 0,
};

const App: React.FC = () => {
  const { items, setItems, fileName, handleSave } = useMacroButtonData();
  const { handleDragEnd } = useMacroButtonDnD(items, setItems);
  const [editModal, setEditModal] = useState<{ open: boolean; id: string | null }>({ open: false, id: null });

  // 削除ボタン押下時の処理
  const handleDelete = (id: string) => {
    setItems((prev) => {
      let filtered = prev.filter((item) => item.ctrl.id !== id);
      const usedIndexes = new Set(filtered.map((item) => item["@_index"]));
      while (filtered.length < MACROBUTTON_MAX) {
        let newIndex = 1;
        while (usedIndexes.has(newIndex)) newIndex++;
        filtered.push({
          ...defaultMacroButton,
          ctrl: { id: uuidv4() },
          "@_index": newIndex,
        });
        usedIndexes.add(newIndex);
      }
      return filtered;
    });
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        height: "100vh",
      }}
    >
      <Header onSave={handleSave} />
      <main style={mainStyle}>
        {fileName && <FileNameBar fileName={fileName} />}
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={items.map((i) => i.ctrl.id)}
            strategy={rectSortingStrategy}
          >
            <div style={gridStyle}>
              {items.map((item, idx) => (
                <SortableItem
                  key={item.ctrl.id}
                  id={item.ctrl.id}
                  index={idx + 1}
                  name={item.MB_Name}
                  subName={item.MB_Subname}
                  type={item["@_type"]}
                  onDelete={handleDelete}
                  onEdit={(id) => setEditModal({ open: true, id })}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
        <EditModal
          open={editModal.open}
          item={
            editModal.id
              ? items.find((i) => i.ctrl.id === editModal.id) ?? null
              : null
          }
          onOk={(vals: Partial<MacroButtonElement>) => {
            if (!editModal.id) return;
            setItems((prev) =>
              prev.map((item) =>
                item.ctrl.id === editModal.id ? { ...item, ...vals } : item
              )
            );
            setEditModal({ open: false, id: null });
          }}
          onCancel={() => setEditModal({ open: false, id: null })}
        />
      </main>
      <Footer />
    </div>
  );
};

export default App;

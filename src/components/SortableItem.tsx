import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { SORTABLE_ITEM_SIZE } from "../constants";

// props型はApp.tsxのまま
interface SortableItemProps {
  id: string;
  index: number;
  name: string;
  subName: string;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
  type?: string;
}

const SortableItem: React.FC<SortableItemProps> = ({
  id,
  index,
  name,
  subName,
  onDelete,
  onEdit,
  type,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });
  const style: React.CSSProperties = {
    userSelect: "none",
    background: isDragging ? "#e0e7ff" : "#fff",
    border: "1px solid #bbb",
    borderRadius: 8,
    width: SORTABLE_ITEM_SIZE,
    height: SORTABLE_ITEM_SIZE,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    boxShadow: isDragging ? "0 2px 8px #8882" : undefined,
    transition,
    transform: CSS.Transform.toString(transform),
    fontSize: 15,
    padding: 6,
    boxSizing: "border-box",
  };
  let typeLabel = "";
  if (type === "0" || type === undefined) typeLabel = "PUSH";
  else if (type === "1") typeLabel = "2P";

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
        <span style={{ flex: 1, textAlign: "left", fontWeight: 600 }}>
          {index}
        </span>
        <button
          style={{
            background: "none",
            border: "none",
            fontSize: 18,
            cursor: "pointer",
            marginRight: 2,
          }}
          title="メニュー"
          onClick={(e) => {
            e.stopPropagation();
            onEdit(id);
          }}
        >
          <span role="img" aria-label="menu">
            ⋮
          </span>
        </button>
        <button
          style={{
            background: "none",
            border: "none",
            fontSize: 18,
            cursor: "pointer",
            color: "#d33",
          }}
          title="削除"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(id);
          }}
        >
          <span role="img" aria-label="delete">
            ✖
          </span>
        </button>
      </div>
      <div
        style={{
          width: "100%",
          textAlign: "left",
          fontSize: 24,
          wordBreak: "break-all",
          cursor: "grab",
          userSelect: "none",
          display: "flex",
          alignItems: "flex-start",
        }}
        {...listeners}
      >
        <span
          style={{
            width: "100%",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            display: "block",
          }}
        >
          {name}
        </span>
      </div>
      <div
        style={{
          width: "100%",
          textAlign: "left",
          fontSize: 13,
          wordBreak: "break-all",
          cursor: "grab",
          userSelect: "none",
          flex: 1,
          display: "flex",
          alignItems: "flex-start",
        }}
        {...listeners}
      >
        <span
          style={{
            width: "100%",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            display: "block",
          }}
        >
          {subName}
        </span>
      </div>
      <div
        style={{
          width: "100%",
          textAlign: "right",
          fontSize: 13,
          marginTop: 2,
        }}
        {...listeners}
      >
        {typeLabel}
      </div>
    </div>
  );
};

export default SortableItem;

import React from "react";
import { MoreVertical, Trash2, GripVertical } from "lucide-react";
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

  // アイコンボタン共通スタイル
  const iconButtonStyle: React.CSSProperties = {
    background: "none",
    border: "none",
    fontSize: 18,
    marginRight: 6,
    display: "flex",
    alignItems: "center",
    padding: 2,
    borderRadius: "50%",
    transition: "background 0.2s ease",
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
        <button
          style={{ ...iconButtonStyle, cursor: "grab" }}
          title="並べ替え"
          tabIndex={-1}
          type="button"
          onMouseEnter={(e) => e.currentTarget.style.background = "#f0f0f0"}
          onMouseLeave={(e) => e.currentTarget.style.background = "none"}
          {...listeners}
        >
          <GripVertical size={20} />
        </button>
        <span
          style={{
            flex: 1,
            textAlign: "left",
            fontWeight: 600,
            fontSize: 16,
            display: "flex",
            alignItems: "center",
          }}
        >
          {index}
        </span>
        <button
          style={{ ...iconButtonStyle, cursor: "pointer" }}
          title="メニュー"
          tabIndex={-1}
          onMouseEnter={(e) => e.currentTarget.style.background = "#f0f0f0"}
          onMouseLeave={(e) => e.currentTarget.style.background = "none"}
        >
          <MoreVertical size={20} />
        </button>
        <button
          style={{ ...iconButtonStyle, cursor: "pointer", marginRight: 0 }}
          title="削除"
          onMouseEnter={(e) => e.currentTarget.style.background = "#f0f0f0"}
          onMouseLeave={(e) => e.currentTarget.style.background = "none"}
          onClick={(e) => {
            e.stopPropagation();
            onDelete(id);
          }}
        >
          <Trash2 size={20} />
        </button>
      </div>
      <div
        style={{
          width: "100%",
          textAlign: "left",
          fontSize: 24,
          wordBreak: "break-all",
          userSelect: "none",
          display: "flex",
          alignItems: "flex-start",
          cursor: "pointer",
        }}
        onClick={(e) => {
          e.stopPropagation();
          onEdit(id);
        }}
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
          userSelect: "none",
          flex: 1,
          display: "flex",
          alignItems: "flex-start",
          cursor: "pointer",
        }}
        onClick={(e) => {
          e.stopPropagation();
          onEdit(id);
        }}
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
          cursor: "pointer",
        }}
        onClick={(e) => {
          e.stopPropagation();
          onEdit(id);
        }}
      >
        {typeLabel}
      </div>
    </div>
  );
};

export default SortableItem;

import React from "react";

export interface ContextMenuItem {
  label: string;
  onClick: () => void;
}

interface ContextMenuProps {
  open: boolean;
  anchorEl?: React.RefObject<HTMLElement | null>;
  onClose: () => void;
  items: ContextMenuItem[];
}

const ContextMenu: React.FC<ContextMenuProps> = ({ open, anchorEl, onClose, items }) => {
  if (!open) return null;
  return (
    <div
      style={{
        position: "absolute",
        top: 28,
        right: 0,
        minWidth: 100,
        background: "#fff",
        border: "1px solid #ccc",
        borderRadius: 6,
        boxShadow: "0 2px 8px #8882",
        zIndex: 10,
        padding: "4px 0",
      }}
    >
      {items.map((item, idx) => (
        <button
          key={idx}
          style={{
            width: "100%",
            background: "none",
            border: "none",
            textAlign: "left",
            padding: "8px 16px",
            fontSize: 15,
            cursor: "pointer",
            color: "#333",
            transition: "background 0.2s",
          }}
          onClick={(e) => {
            e.stopPropagation();
            item.onClick();
            onClose();
          }}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
};

export default ContextMenu;

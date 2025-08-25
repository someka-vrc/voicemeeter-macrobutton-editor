import React from "react";
import { APP_NAME } from "../constants";

type HeaderProps = {
  onSave: () => void;
};

const headerStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  background: "#222",
  color: "#fff",
  padding: "0 1.5rem",
  height: 56,
  minHeight: 56,
  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
};

const iconButtonStyle: React.CSSProperties = {
  background: "none",
  border: "none",
  color: "#fff",
  cursor: "pointer",
  fontSize: 22,
  marginLeft: 12,
  padding: 4,
};

const Header: React.FC<HeaderProps> = ({ onSave }) => (
  <header style={headerStyle}>
    <span style={{ fontWeight: 700, fontSize: 20 }}>
      {APP_NAME}
    </span>
    <div>
      <button
        style={iconButtonStyle}
        title="ファイルを保存"
        onClick={onSave}
      >
        <span role="img" aria-label="save">
          💾
        </span>
      </button>
    </div>
  </header>
);

export default Header;

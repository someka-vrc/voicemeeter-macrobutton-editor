import React from "react";
import { APP_COPYRIGHT, APP_VERSION } from "../constants";

const footerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  background: "#222",
  color: "#fff",
  height: 36,
  minHeight: 36,
  padding: "0 1.5rem",
  fontSize: 14,
};

const Footer: React.FC = () => (
  <footer style={footerStyle}>
    <span>{APP_COPYRIGHT}</span>
    <span>v{APP_VERSION}</span>
  </footer>
);

export default Footer;

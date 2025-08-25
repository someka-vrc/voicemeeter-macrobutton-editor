import React from "react";

type FileNameBarProps = {
  fileName: string;
};

const FileNameBar: React.FC<FileNameBarProps> = ({ fileName }) => (
  <div
    style={{
      marginBottom: 16,
      fontWeight: 600,
      fontSize: 16,
      color: "#333",
    }}
  >
    File name: {fileName}
  </div>
);

export default FileNameBar;

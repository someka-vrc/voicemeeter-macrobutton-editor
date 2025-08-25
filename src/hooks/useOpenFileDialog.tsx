import { useRef } from "react";

export function useOpenFileDialog(onFile: (file: File) => void) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const open = () => {
    inputRef.current?.click();
  };

  const FileInput = (
    <input
      type="file"
      accept=".xml"
      style={{ display: "none" }}
      ref={inputRef}
      onChange={e => {
        const file = e.target.files?.[0];
        if (file) onFile(file);
        e.target.value = "";
      }}
    />
  );

  return { open, FileInput };
}

import { useState } from "react";

export function usePromptInput() {
  const [value, setValue] = useState("");
  const [files, setFiles] = useState<File[]>([]);

  return {
    value,
    setValue,
    files,
    setFiles,
  };
}

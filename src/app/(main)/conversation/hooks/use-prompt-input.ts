import { useState } from "react";

export function usePromptInput() {
  const [value, setValue] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const addFile = (file: File) => {
    setFiles((prev) => [...prev, file]);

    // 이미지 파일인 경우에만 preview URL 생성
    if (file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      setPreviewUrls((prev) => [...prev, url]);
    } else {
      // 이미지가 아닌 파일은 빈 문자열로 placeholder 추가
      setPreviewUrls((prev) => [...prev, ""]);
    }
  };

  const removeFile = (index: number) => {
    // URL이 존재하면 revoke
    const urlToRevoke = previewUrls[index];
    if (urlToRevoke) {
      URL.revokeObjectURL(urlToRevoke);
    }

    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const clearState = () => {
    setValue("");
    setFiles([]);

    setPreviewUrls((currentUrls) => {
      currentUrls.forEach((url) => {
        if (url) {
          URL.revokeObjectURL(url);
        }
      });
      return [];
    });
  };

  return {
    value,
    setValue,
    files,
    addFile,
    removeFile,
    previewUrls,
    clearState,
  };
}

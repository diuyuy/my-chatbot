"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
} from "@/components/ui/select";
import { useConversationSettings } from "@/hooks/use-conversation-settings";
import {
  FileSearchIcon,
  FileText,
  PaperclipIcon,
  Plus,
  Send,
  SquareIcon,
  X,
} from "lucide-react";
import { useEffect, useRef } from "react";

interface PromptInputProps {
  value: string;
  setValue: (value: string) => void;
  files: File[];
  addFile: (file: File) => void;
  removeFile: (index: number) => void;
  previewUrls: string[];
  stop?: () => void;
  isSending: boolean;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
  maxHeight?: number;
}

export function PromptInput({
  value,
  setValue,
  files,
  addFile,
  removeFile,
  previewUrls,
  isSending,
  stop,
  className = "",
  placeholder = "메시지를 입력하세요...",
  disabled = false,
  maxHeight = 200,
}: PromptInputProps) {
  // 전역 상태는 컴포넌트 내부에서 직접 가져오기
  const { modelProvider, setModelProvider, isRag, setIsRag } =
    useConversationSettings();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      // form의 submit 이벤트를 트리거
      const form = e.currentTarget.form;
      if (form && value.trim()) {
        form.requestSubmit();
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;

    const newFile = selectedFiles[0];

    // 파일 타입 검사 (.txt 또는 이미지만 허용)
    const validImageTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    const isValidFile =
      newFile.type === "text/plain" || validImageTypes.includes(newFile.type);

    if (!isValidFile) {
      alert("txt 파일 또는 이미지만 업로드할 수 있습니다.");
      e.target.value = "";
      return;
    }

    // 최대 파일 개수 검사 (10개)
    if (files && files.length >= 10) {
      alert("최대 10개의 파일만 업로드할 수 있습니다.");
      e.target.value = "";
      return;
    }

    addFile(newFile);
    e.target.value = ""; // Reset input
  };

  const handleFileUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveFile = (index: number) => {
    removeFile(index);
  };

  // Auto-sizing textarea logic
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    // Reset height to auto to get the correct scrollHeight
    textarea.style.height = "auto";

    // Calculate new height
    const newHeight = Math.min(textarea.scrollHeight, maxHeight);
    textarea.style.height = `${newHeight}px`;
  }, [value, maxHeight]);

  return (
    <div
      className={`mx-4 mb-8 mt-4 flex flex-col border rounded-lg bg-background shadow-sm max-w-3xl mx-auto${className}`}
    >
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".txt,image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* File Preview Section */}
      {files.length > 0 && (
        <div className="flex flex-wrap gap-2 p-3 pb-0">
          {files.map((file, index) => {
            const isImage = file.type.startsWith("image/");
            const isText = file.type === "text/plain";

            return (
              <div
                key={index}
                className="relative flex items-center gap-2 p-2 border rounded-lg bg-muted/50 group"
              >
                {isImage && previewUrls[index] && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={previewUrls[index]}
                    alt={file.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                )}
                {isText && (
                  <div className="flex items-center gap-2">
                    <FileText className="w-8 h-8 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground max-w-25 truncate">
                      {file.name}
                    </span>
                  </div>
                )}
                {/* Remove button */}
                <button
                  type="button"
                  onClick={() => handleRemoveFile(index)}
                  className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:cursor-pointer"
                >
                  <X strokeWidth={3} className="w-3 h-3" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Textarea Section */}
      <div className="flex-1 p-3">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full resize-none border-none outline-none bg-transparent text-sm placeholder:text-muted-foreground disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            minHeight: "24px",
            maxHeight: `${maxHeight}px`,
            overflowY: "auto",
          }}
          rows={1}
        />
      </div>

      {/* Button Section */}
      <div className="flex items-center justify-between gap-2 px-3 pb-3 pt-0">
        {/* Left: Plus button */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              disabled={disabled}
              className="shrink-0"
            >
              <Plus className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={handleFileUploadClick}>
              <PaperclipIcon />
              파일 업로드
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem
              checked={isRag}
              onCheckedChange={setIsRag}
            >
              <FileSearchIcon /> RAG
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Center & Right: Model selector and Send button */}
        <div className="flex items-center gap-2">
          {/* Model Selector Button */}
          <Select defaultValue={modelProvider} onValueChange={setModelProvider}>
            <SelectTrigger>{modelProvider}</SelectTrigger>
            <SelectContent position="popper">
              <SelectGroup>
                <SelectLabel>Google</SelectLabel>
                <SelectItem value={"gemini-2.0-flash"}>
                  gemini-2.0-flash
                </SelectItem>
                <SelectItem value={"gemini-2.5-flash"}>
                  gemini-2.5-flash
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          {/* Send Button */}
          {isSending ? (
            <Button type="button" onClick={stop}>
              <SquareIcon className="size-4" />
            </Button>
          ) : (
            <Button
              type="submit"
              variant="default"
              size="icon-sm"
              disabled={disabled || !value.trim()}
              className="shrink-0"
            >
              <Send className="size-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

import { useRef, useState } from "react";
import { Icon } from "./Icon";

interface DropzoneProps {
  folder: string;
  busy: boolean;
  onFiles: (files: FileList | File[]) => void;
}

export function Dropzone({ folder, busy, onFiles }: DropzoneProps) {
  const input = useRef<HTMLInputElement>(null);
  const [hot, setHot] = useState(false);

  return (
    <div
      className={hot ? "wp-dropzone hot" : "wp-dropzone"}
      onDragOver={(e) => {
        e.preventDefault();
        setHot(true);
      }}
      onDragLeave={() => setHot(false)}
      onDrop={(e) => {
        e.preventDefault();
        setHot(false);
        onFiles(e.dataTransfer.files);
      }}
      onClick={() => input.current?.click()}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && input.current?.click()}
    >
      <Icon.upload size={22} />
      <p>{busy ? "Uploading…" : "Drop files or click to upload"}</p>
      <p className="wp-muted">Destination: /media/{folder || ""}</p>
      <input
        ref={input}
        type="file"
        multiple
        hidden
        onChange={(e) => {
          if (e.target.files) onFiles(e.target.files);
          e.target.value = "";
        }}
      />
    </div>
  );
}

import { useEffect, useState } from "react";
import { useFilteredMedia, useMedia } from "../hooks/useMedia";
import { IconButton } from "./Button";
import { Dropzone } from "./Dropzone";
import { Icon } from "./Icon";
import { MediaGrid } from "./MediaGrid";

interface MediaModalProps {
  value?: string;
  folder: string;
  onSelect: (path: string) => void;
  onClose: () => void;
}

export function MediaModal({ value, folder, onSelect, onClose }: MediaModalProps) {
  const media = useMedia();
  const [filter, setFilter] = useState("");
  const shown = useFilteredMedia(media.files, filter);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="wp-modal-scrim" onClick={onClose}>
      <div className="wp-modal" role="dialog" aria-label="Media library" onClick={(e) => e.stopPropagation()}>
        <header className="wp-modal-head">
          <h2>Select media</h2>
          <IconButton label="Close" icon={<Icon.close />} onClick={onClose} />
        </header>
        <div className="wp-modal-body">
          <input className="wp-input" autoFocus type="search" placeholder="Search media…" value={filter} onChange={(e) => setFilter(e.target.value)} />
          <Dropzone
            folder={folder}
            busy={media.busy}
            onFiles={(files) =>
              void media.upload(folder, files).then((path) => {
                if (path) {
                  onSelect(path);
                  onClose();
                }
              })
            }
          />
          {media.error && <p className="wp-error" role="alert">{media.error}</p>}
          <MediaGrid
            files={shown}
            selected={value}
            onPick={(path) => {
              onSelect(path);
              onClose();
            }}
          />
        </div>
      </div>
    </div>
  );
}

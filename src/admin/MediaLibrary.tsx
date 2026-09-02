import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { asset } from "../asset";
import { deleteMedia, fetchMedia, uploadMedia } from "./api";
import { Button, Empty, Field, Icon, IconButton } from "./ui";

const VIDEO = /\.(webm|mp4)$/i;

export function isVideo(path: string): boolean {
  return VIDEO.test(path);
}

export function useMedia() {
  const [files, setFiles] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>();

  const reload = useCallback(() => {
    fetchMedia()
      .then(setFiles)
      .catch((e) => setError(e.message));
  }, []);

  useEffect(reload, [reload]);

  const upload = useCallback(
    async (folder: string, list: FileList | File[]) => {
      const chosen = Array.from(list);
      if (chosen.length === 0) return undefined;
      setBusy(true);
      setError(undefined);
      try {
        let last = "";
        for (const file of chosen) last = await uploadMedia(folder, file);
        setFiles(await fetchMedia());
        return last;
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
        return undefined;
      } finally {
        setBusy(false);
      }
    },
    [],
  );

  const remove = useCallback(async (path: string) => {
    setError(undefined);
    try {
      await deleteMedia(path);
      setFiles(await fetchMedia());
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }, []);

  return { files, busy, error, reload, upload, remove };
}

export function Thumb({ path, controls }: { path: string; controls?: boolean }) {
  const src = asset(path);
  const video = useRef<HTMLVideoElement>(null);

  if (!isVideo(path)) return <img src={src} alt="" loading="lazy" />;

  if (controls) return <video src={src} controls muted loop playsInline preload="metadata" />;

  return (
    <span className="wp-video-thumb">
      <video
        ref={video}
        src={src}
        muted
        loop
        playsInline
        preload="metadata"
        onMouseEnter={() => {
          if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
          video.current?.play().catch(() => undefined);
        }}
        onMouseLeave={() => {
          const node = video.current;
          if (!node) return;
          node.pause();
          node.currentTime = 0;
        }}
      />
      <Icon.video size={16} />
    </span>
  );
}

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

interface MediaGridProps {
  files: string[];
  selected?: string;
  onPick: (path: string) => void;
  onDelete?: (path: string) => void;
}

export function MediaGrid({ files, selected, onPick, onDelete }: MediaGridProps) {
  if (files.length === 0) return <Empty title="No media yet" hint="Upload files to see them here." />;

  return (
    <ul className="wp-media-grid">
      {files.map((path) => (
        <li key={path} className={path === selected ? "wp-media selected" : "wp-media"}>
          <button type="button" className="wp-media-btn" onClick={() => onPick(path)}>
            <Thumb path={path} />
            <span className="wp-media-name">{path.replace("/media/", "")}</span>
          </button>
          {onDelete && (
            <span className="wp-media-actions">
              <IconButton label={`Delete ${path}`} icon={<Icon.trash size={15} />} danger onClick={() => onDelete(path)} />
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}

function useFiltered(files: string[], filter: string) {
  return useMemo(() => {
    const needle = filter.trim().toLowerCase();
    return needle ? files.filter((f) => f.toLowerCase().includes(needle)) : files;
  }, [files, filter]);
}

export function MediaLibraryScreen() {
  const media = useMedia();
  const [filter, setFilter] = useState("");
  const [folder, setFolder] = useState("");
  const [copied, setCopied] = useState<string>();
  const shown = useFiltered(media.files, filter);

  return (
    <div className="wp-screen">
      <header className="wp-screen-head">
        <h1>Media</h1>
        <input className="wp-input wp-search" type="search" placeholder="Search media…" value={filter} onChange={(e) => setFilter(e.target.value)} />
      </header>

      <div className="wp-media-upload">
        <Field label="Upload folder" hint="Usually the project slug.">
          <input className="wp-input" type="text" value={folder} placeholder="thorn" onChange={(e) => setFolder(e.target.value)} />
        </Field>
        <Dropzone folder={folder} busy={media.busy} onFiles={(files) => void media.upload(folder, files)} />
      </div>

      {media.error && <p className="wp-error" role="alert">{media.error}</p>}
      {copied && <p className="wp-notice">Copied {copied}</p>}

      <MediaGrid
        files={shown}
        onPick={(path) => {
          void navigator.clipboard?.writeText(path);
          setCopied(path);
        }}
        onDelete={(path) => {
          if (confirm(`Delete ${path}? The file is removed from public/media.`)) void media.remove(path);
        }}
      />
    </div>
  );
}

interface MediaModalProps {
  value?: string;
  folder: string;
  onSelect: (path: string) => void;
  onClose: () => void;
}

export function MediaModal({ value, folder, onSelect, onClose }: MediaModalProps) {
  const media = useMedia();
  const [filter, setFilter] = useState("");
  const shown = useFiltered(media.files, filter);

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

interface MediaInputProps {
  label: string;
  value: string | undefined;
  folder: string;
  onChange: (path: string) => void;
  hint?: string;
}

export function MediaInput({ label, value, folder, onChange, hint }: MediaInputProps) {
  const [open, setOpen] = useState(false);
  return (
    <div className="wp-media-input">
      <Field label={label} hint={hint}>
        <div className="wp-media-input-row">
          <input className="wp-input" type="text" value={value ?? ""} onChange={(e) => onChange(e.target.value)} />
          <Button onClick={() => setOpen(true)}>Browse</Button>
        </div>
      </Field>
      {value && (
        <div className="wp-media-preview">
          <Thumb path={value} controls />
        </div>
      )}
      {open && <MediaModal value={value} folder={folder} onSelect={onChange} onClose={() => setOpen(false)} />}
    </div>
  );
}

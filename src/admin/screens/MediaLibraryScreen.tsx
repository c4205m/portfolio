import { useState } from "react";
import { Dropzone, Field, MediaGrid } from "../components";
import { useFilteredMedia, useMedia } from "../hooks";

export function MediaLibraryScreen() {
  const media = useMedia();
  const [filter, setFilter] = useState("");
  const [folder, setFolder] = useState("");
  const [copied, setCopied] = useState<string>();
  const shown = useFilteredMedia(media.files, filter);

  return (
    <div className="wp-screen">
      <header className="wp-screen-head">
        <h1>Media</h1>
        <input className="wp-input wp-search" type="search" placeholder="Search media…" value={filter} onChange={(e) => setFilter(e.target.value)} />
      </header>

      <div className="wp-media-upload">
        <Field label="Upload folder" hint="Usually the project slug.">
          <input className="wp-input" type="text" value={folder} placeholder="project-slug" onChange={(e) => setFolder(e.target.value)} />
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

import { useCallback, useEffect, useMemo, useState } from "react";
import { deleteMedia, fetchMedia, uploadMedia } from "../api";

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

  const upload = useCallback(async (folder: string, list: FileList | File[]) => {
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
  }, []);

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

export function useFilteredMedia(files: string[], filter: string) {
  return useMemo(() => {
    const needle = filter.trim().toLowerCase();
    return needle ? files.filter((f) => f.toLowerCase().includes(needle)) : files;
  }, [files, filter]);
}

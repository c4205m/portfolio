import { IconButton } from "./Button";
import { Empty } from "./Empty";
import { Icon } from "./Icon";
import { Thumb } from "./Thumb";

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

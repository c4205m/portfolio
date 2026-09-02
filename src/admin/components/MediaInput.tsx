import { useState } from "react";
import { Button } from "./Button";
import { Field } from "./Field";
import { MediaModal } from "./MediaModal";
import { Thumb } from "./Thumb";

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

export function Checkbox({ label, checked, onChange }: { label: string; checked: boolean | undefined; onChange: (v: boolean | undefined) => void }) {
  return (
    <label className="wp-checkbox">
      <input type="checkbox" checked={checked ?? false} onChange={(e) => onChange(e.target.checked || undefined)} />
      <span>{label}</span>
    </label>
  );
}

import { useState } from 'react';

interface FileUploadProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  error?: string | React.ReactNode;
}

export function FileUpload({ id, error, onChange, ...props }: FileUploadProps) {
  const [fileName, setFileName] = useState<string | null>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setFileName(file?.name ?? null);
    onChange?.(event);
  };

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="text-xs font-medium text-white/40 uppercase tracking-widest"
      >
        Photo
      </label>

      <label
        htmlFor={id}
        className="
          flex items-center gap-3 px-4 py-3 cursor-pointer
          rounded-xl border border-dashed border-white/[0.10]
          bg-white/[0.02] hover:bg-white/[0.05]
          text-sm text-white/30 hover:text-white/50
          transition duration-150
        "
      >
        <span className={fileName ? 'text-white/70 truncate' : undefined}>
          {fileName ?? 'PNG or JPEG, max 5MB'}
        </span>

        <input
          id={id}
          type="file"
          className="sr-only"
          onChange={handleChange}
          {...props}
        />
      </label>

      <span className="min-h-[16px] text-xs text-red-400">{error}</span>
    </div>
  );
}

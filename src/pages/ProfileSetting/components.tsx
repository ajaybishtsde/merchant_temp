import { FiEdit2 } from 'react-icons/fi';

export const ProfileRow = ({
  label,
  value,
  editing,
  onEdit,
  onChange,
}: {
  label: string;
  value: string;
  editing?: boolean;
  onEdit: () => void;
  onChange: (val: string) => void;
}) => {
  return (
    <div className="flex justify-between items-center border-b pb-3">
      <div className="text-gray-500">{label}</div>

      <div className="flex items-center gap-3">
        {editing ? (
          <input
            autoFocus
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="border-b outline-none text-right font-medium"
          />
        ) : (
          <div className="font-medium">{value}</div>
        )}

        <button onClick={onEdit} className="text-gray-400 hover:text-black">
          <FiEdit2 />
        </button>
      </div>
    </div>
  );
};

export const EditableField = ({
  value,
  editing,
  onEdit,
  onChange,
  className,
}: {
  value: string;
  editing?: boolean;
  onEdit: () => void;
  onChange: (val: string) => void;
  className?: string;
}) => {
  return (
    <div className="flex items-center gap-3">
      {editing ? (
        <input
          autoFocus
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`border-b outline-none ${className}`}
        />
      ) : (
        <div className={className}>{value}</div>
      )}

      <button onClick={onEdit} className="text-gray-400 hover:text-black">
        <FiEdit2 />
      </button>
    </div>
  );
};

interface Props {
  label: string;
  file?: string;
  loading?: boolean;
  inputRef?: React.RefObject<HTMLInputElement>;
  onUpload: (file?: File) => void;
}
export const DocumentUploadRow = ({ label, file, loading, inputRef, onUpload }: Props) => {
  console.log('>>>>>>>>>>>>>>>>>>>', file);
  return (
    <div className="relative border rounded-lg p-4 flex items-center justify-between">
      <div>
        <p className="font-medium">{label}</p>

        {file ? (
          <a
            href={file}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary text-sm underline"
          >
            View uploaded PDF
          </a>
        ) : (
          <p className="text-gray-400 text-sm">No document uploaded</p>
        )}
      </div>

      <label className="cursor-pointer bg-primary text-white px-4 py-2 rounded">
        Upload
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={(e) => onUpload(e.target.files?.[0])}
        />
      </label>

      {/* Spinner */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/70 rounded-lg">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
};

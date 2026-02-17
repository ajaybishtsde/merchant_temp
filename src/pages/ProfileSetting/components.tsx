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

export const DocumentUploadRow = ({
  label,
  file,
  onUpload,
}: {
  label: string;
  file?: string;
  onUpload: (file?: File) => void;
}) => {
  return (
    <div className="flex justify-between items-center border rounded-lg p-4">
      <div>
        <div className="font-medium">{label}</div>

        {file ? (
          <a href={file} target="_blank" className="text-sm text-green-600 underline">
            View Uploaded PDF
          </a>
        ) : (
          <div className="text-sm text-gray-400">Not uploaded</div>
        )}
      </div>

      <label className="bg-gray-100 px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-200 text-sm">
        Upload PDF
        <input
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={(e) => onUpload(e.target.files?.[0])}
        />
      </label>
    </div>
  );
};

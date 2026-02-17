export const SettingsCard = ({
  icon,
  title,
  description,
  buttonText,
  onClick,
  danger = false,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  buttonText: string;
  onClick: () => void;
  danger?: boolean;
}) => {
  return (
    <div className="flex items-center justify-between border rounded-xl p-5 hover:shadow transition">
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-lg ${danger ? 'bg-red-100 text-red-600' : 'bg-gray-100'}`}>
          {icon}
        </div>

        <div>
          <div className="font-semibold">{title}</div>
          <div className="text-sm text-gray-500">{description}</div>
        </div>
      </div>

      <button
        onClick={onClick}
        className={`px-5 py-2 rounded-lg font-medium transition ${
          danger
            ? 'bg-red-600 text-white hover:bg-red-700'
            : 'bg-primary text-white hover:opacity-90'
        }`}
      >
        {buttonText}
      </button>
    </div>
  );
};

import { FiEye, FiEyeOff } from 'react-icons/fi';

export const PasswordInput = ({
  label,
  value,
  setValue,
  show,
  setShow,
}: {
  label: string;
  value: string;
  setValue: (val: string) => void;
  show: boolean;
  setShow: (val: boolean) => void;
}) => {
  return (
    <div>
      <label className="text-sm text-gray-600">{label}</label>

      <div className="relative mt-1">
        <input
          type={show ? 'text' : 'password'}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full border rounded-lg px-3 py-2 pr-10"
        />

        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
        >
          {show ? <FiEyeOff /> : <FiEye />}
        </button>
      </div>
    </div>
  );
};

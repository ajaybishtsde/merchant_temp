import { useState } from 'react';
import { toast } from 'react-toastify';
import { FiX } from 'react-icons/fi';
import { MerchantAPI } from '@/utils/api/merchant.api';
import { PasswordInput } from './PasswordInput';
import LoadingButton from '@/components/common/LoadingButton';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const ChangePasswordModal = ({ isOpen, onClose }: Props) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  if (!isOpen) return null;

  const resetForm = () => {
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setShowOld(false);
    setShowNew(false);
    setShowConfirm(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      return toast.error('All fields are required');
    }

    if (newPassword !== confirmPassword) {
      return toast.error('New passwords do not match');
    }

    try {
      setLoading(true);

      const payload = {
        currentPassword: oldPassword,
        newPassword,
      };

      const res = await MerchantAPI.changePassword(payload);

      if (res?.status) {
        toast.success('Password reset successfullly');
        resetForm();
        onClose();
      }
    } catch (err: any) {
      toast.error(err?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white w-full max-w-md rounded-xl shadow-xl p-6 relative">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-black"
        >
          <FiX size={20} />
        </button>

        <h2 className="text-xl font-semibold mb-6">Change Password</h2>

        <div className="space-y-4">
          {/* Old Password */}
          <PasswordInput
            label="Old Password"
            value={oldPassword}
            setValue={setOldPassword}
            show={showOld}
            setShow={setShowOld}
          />

          {/* New Password */}
          <PasswordInput
            label="New Password"
            value={newPassword}
            setValue={setNewPassword}
            show={showNew}
            setShow={setShowNew}
          />

          {/* Confirm Password */}
          <PasswordInput
            label="Confirm New Password"
            value={confirmPassword}
            setValue={setConfirmPassword}
            show={showConfirm}
            setShow={setShowConfirm}
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-8">
          <LoadingButton
            type="submit"
            onClick={handleChangePassword}
            loading={loading}
            className="w-full rounded-lg bg-primary text-white p-4"
          >
            {loading ? 'Updating...' : 'Update Password'}
          </LoadingButton>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordModal;

import { useState } from 'react';
import DefaultLayout from '@/layout/DefaultLayout';
import BreadCrumb from '@/components/common/ui/BreadCrumb';
import { toast } from 'react-toastify';
import { FiLock, FiLogOut, FiTrash2 } from 'react-icons/fi';
import ChangePasswordModal from './component/ChangePasswordModal';
import { SettingsCard } from './component/SettingsCard';
import { useCurrentUser } from '@/context/userContext';
import { AdminAPI } from '@/utils/api/admin.api';
import ConfirmDeleteModal from './component/ConfirmDeleteModal';

const AccountSettings = () => {
  const { logOutUser } = useCurrentUser();
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleLogout = () => logOutUser();

  const handleDeleteAccount = async () => {
    try {
      setDeleteLoading(true);

      const res = await AdminAPI.deleteSelf();

      if (res?.status) {
        toast.success(res.message);
        logOutUser(); // logout after delete
      }
    } catch {
      toast.error('Failed to delete account');
    } finally {
      setDeleteLoading(false);
      setIsDeleteModalOpen(false);
    }
  };

  const handleUpdatePassword = () => {
    setIsPasswordModalOpen(true);
  };

  return (
    <DefaultLayout>
      <BreadCrumb pageName="Account Settings" />

      <div className="flex justify-center py-10">
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-8 space-y-8">
          <h2 className="text-2xl font-bold text-center">Account Settings</h2>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700">Security</h3>

            <SettingsCard
              icon={<FiLock size={20} />}
              title="Update Password"
              description="Change your account password to keep your account secure."
              buttonText="Update"
              onClick={handleUpdatePassword}
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700">Session</h3>

            <SettingsCard
              icon={<FiLogOut size={20} />}
              title="Logout"
              description="Sign out from your current session."
              buttonText="Logout"
              onClick={handleLogout}
            />
          </div>

          <div className="space-y-4 border-t pt-6">
            <h3 className="text-lg font-semibold text-red-600">Sensitive Actions</h3>

            <SettingsCard
              icon={<FiTrash2 size={20} />}
              title="Delete Account"
              description="Permanently delete your account and all associated data."
              buttonText="Delete Account"
              danger
              onClick={() => setIsDeleteModalOpen(true)}
            />
          </div>
        </div>
      </div>
      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteAccount}
        loading={deleteLoading}
      />
    </DefaultLayout>
  );
};

export default AccountSettings;

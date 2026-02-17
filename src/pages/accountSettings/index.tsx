import React, { useState } from 'react';
import DefaultLayout from '@/layout/DefaultLayout';
import BreadCrumb from '@/components/common/ui/BreadCrumb';
import { toast } from 'react-toastify';
import { FiLock, FiLogOut, FiTrash2 } from 'react-icons/fi';
import ChangePasswordModal from './component/ChangePasswordModal';
import { SettingsCard } from './component/SettingsCard';

const AccountSettings = () => {
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  /* ---------------- DUMMY ACTIONS ---------------- */

  const handleLogout = () => {
    toast.success('Logged out (dummy)');
    // TODO → clear token + redirect
  };

  const handleDeleteAccount = () => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete your account? This action cannot be undone.',
    );

    if (!confirmDelete) return;

    toast.success('Account deleted (dummy)');
    // TODO → call delete API
  };

  const handleUpdatePassword = () => {
    setIsPasswordModalOpen(true);
  };

  /* ---------------- UI ---------------- */

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
              onClick={handleDeleteAccount}
            />
          </div>
        </div>
      </div>
      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />
    </DefaultLayout>
  );
};

export default AccountSettings;

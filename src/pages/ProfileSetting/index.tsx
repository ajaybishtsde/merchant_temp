import { useEffect, useRef, useState } from 'react';
import DefaultLayout from '@/layout/DefaultLayout';
import BreadCrumb from '@/components/common/ui/BreadCrumb';
import { toast } from 'react-toastify';
import { FiEdit2 } from 'react-icons/fi';
import { DocumentUploadRow, EditableField, ProfileRow } from './components';
import { AdminAPI } from '@/utils/api/admin.api';
import dummyUserImage from '@/static/images/user/user_dummy.png';

interface IMerchantProfile {
  id: number;
  email: string;
  documents: string[];
  company_name: string;
  company_address: string;
  company_logo: string;
  contact_person: string;
  contact_number: string;
}

const ProfileSetting = () => {
  const [merchant, setMerchant] = useState<IMerchantProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [logoLoading, setLogoLoading] = useState(false);
  const [docLoading, setDocLoading] = useState(false);
  const docInputRef = useRef<HTMLInputElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  // track which fields are editable
  const [editing, setEditing] = useState<Record<string, boolean>>({});

  const toggleEdit = (field: string) => {
    setEditing((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const fetchMerchantProfile = async () => {
    try {
      const res = await AdminAPI.getProfile();
      if (res.status) setMerchant(res.result);
    } catch (error) {
      console.log(error);
    }
  };
  const handleDocumentUpload = async (file?: File) => {
    if (!file || !merchant) return;

    // PDF validation
    if (file.type !== 'application/pdf') {
      toast.error('Only PDF files are allowed');
      if (docInputRef.current) docInputRef.current.value = '';
      return;
    }

    try {
      setDocLoading(true);

      const res = await AdminAPI.updateDocs(file);

      if (res?.status) {
        toast.success('Document uploaded successfully');

        const preview = URL.createObjectURL(file);

        setMerchant((prev) =>
          prev
            ? {
                ...prev,
                documents: res?.result?.documents || preview,
              }
            : prev,
        );
      }
    } catch {
      toast.error('Document upload failed');
    } finally {
      setDocLoading(false);

      if (docInputRef.current) docInputRef.current.value = '';
    }
  };

  const handleChange = (field: keyof IMerchantProfile, value: string) => {
    setMerchant((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const handleUpdate = async () => {
    if (!merchant) return;
    try {
      setLoading(true);
      await AdminAPI.updateProfile(merchant);
      toast.success('Profile Updated Successfully');
      setEditing({});
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMerchantProfile();
  }, []);
  const handleLogoUpload = async (file?: File) => {
    if (!file || !merchant) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Only image files allowed');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    try {
      setLogoLoading(true);

      const res = await AdminAPI.updateLogo(file);

      if (res?.status) {
        toast.success('Logo uploaded successfully');

        const preview = URL.createObjectURL(file);

        setMerchant((prev) =>
          prev
            ? {
                ...prev,
                company_logo: res?.result?.company_logo || preview,
              }
            : prev,
        );
      }
    } catch {
      toast.error('Logo upload failed');
    } finally {
      setLogoLoading(false);

      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <DefaultLayout>
      <BreadCrumb pageName="Merchant Profile" />

      <div className="flex justify-center py-8">
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-8">
          <div className="flex flex-col items-center">
            <div className="relative">
              <img
                src={merchant?.company_logo || dummyUserImage}
                alt="merchant"
                className="w-32 h-32 rounded-full object-cover border-4 border-gray-100 shadow"
              />

              {/* Spinner overlay */}
              {logoLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/60 rounded-full">
                  <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
              )}

              <label className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full cursor-pointer shadow hover:scale-105">
                <FiEdit2 size={16} />

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleLogoUpload(e.target.files?.[0])}
                />
              </label>
            </div>

            <EditableField
              value={merchant?.contact_person || ''}
              editing={editing.name}
              onEdit={() => toggleEdit('name')}
              onChange={(val) => handleChange('contact_person', val)}
              className="text-2xl font-bold text-center mt-5"
            />
          </div>

          <div className="border-t my-8" />

          <div className="space-y-5">
            <ProfileRow
              label="Email"
              value={merchant?.email || ''}
              editing={editing.email}
              onEdit={() => toggleEdit('email')}
              onChange={(val) => handleChange('email', val)}
            />

            <ProfileRow
              label="Phone"
              value={merchant?.contact_number || ''}
              editing={editing.phone}
              onEdit={() => toggleEdit('phone')}
              onChange={(val) => handleChange('contact_number', val)}
            />

            <ProfileRow
              label="Address"
              value={merchant?.company_address || ''}
              editing={editing.address}
              onEdit={() => toggleEdit('address')}
              onChange={(val) => handleChange('company_address', val)}
            />
            <div className="mt-10 flex justify-center">
              <button
                onClick={handleUpdate}
                disabled={loading}
                className="bg-primary text-white px-8 py-3 rounded-lg shadow hover:opacity-90"
              >
                {loading ? 'Updating...' : 'Update Profile'}
              </button>
            </div>
            <div className="pt-8 mt-8">
              <h3 className="text-lg font-semibold mb-4">Documents</h3>

              <div className="space-y-4">
                <DocumentUploadRow
                  label="Docs"
                  file={merchant?.documents?.[0]}
                  loading={docLoading}
                  inputRef={docInputRef}
                  onUpload={handleDocumentUpload}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default ProfileSetting;

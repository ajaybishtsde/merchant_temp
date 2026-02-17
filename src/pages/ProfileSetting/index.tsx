import { useEffect, useState } from 'react';
import DefaultLayout from '@/layout/DefaultLayout';
import BreadCrumb from '@/components/common/ui/BreadCrumb';
import { toast } from 'react-toastify';
import { FiEdit2 } from 'react-icons/fi';
import { DocumentUploadRow, EditableField, ProfileRow } from './components';

interface IMerchantProfile {
  name: string;
  email: string;
  phone: string;
  address: string;
  logo: string;
  documents: {
    docs?: string;
  };
}

const DUMMY_IMAGE =
  'https://images.unsplash.com/photo-1763979366987-a48e62e25113?w=500&auto=format&fit=crop&q=60';

const MerchantAPI = {
  getProfile: () =>
    new Promise<{ status: boolean; result: IMerchantProfile }>((resolve) => {
      setTimeout(() => {
        resolve({
          status: true,
          result: {
            name: 'Acme Pvt Ltd',
            email: 'contact@acme.com',
            phone: '+91 9876543210',
            address: 'Dehradun, Uttarakhand',
            logo: DUMMY_IMAGE,
            documents: {
              docs: '',
            },
          },
        });
      }, 500);
    }),

  updateProfile: (data: IMerchantProfile) => new Promise((resolve) => setTimeout(resolve, 700)),
};

const ProfileSetting = () => {
  const [merchant, setMerchant] = useState<IMerchantProfile | null>(null);
  const [loading, setLoading] = useState(false);

  // track which fields are editable
  const [editing, setEditing] = useState<Record<string, boolean>>({});

  const toggleEdit = (field: string) => {
    setEditing((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const fetchMerchantProfile = async () => {
    try {
      const res = await MerchantAPI.getProfile();
      if (res.status) setMerchant(res.result);
    } catch (error) {
      console.log(error);
    }
  };
  const handleDocumentUpload = (type: 'pan' | 'gst' | 'license', file?: File) => {
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast.error('Only PDF files are allowed');
      return;
    }

    // dummy preview only (no backend upload)
    const fileURL = URL.createObjectURL(file);

    setMerchant((prev) =>
      prev
        ? {
            ...prev,
            documents: {
              ...prev.documents,
              [type]: fileURL,
            },
          }
        : prev,
    );

    toast.success(`${type.toUpperCase()} uploaded`);
  };

  const handleChange = (field: keyof IMerchantProfile, value: string) => {
    setMerchant((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const handleUpdate = async () => {
    if (!merchant) return;
    console.log('>>>>>>>>>>>>>>>>>>>>>>', merchant);
    try {
      setLoading(true);
      await MerchantAPI.updateProfile(merchant);
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

  return (
    <DefaultLayout>
      <BreadCrumb pageName="Merchant Profile" />

      <div className="flex justify-center py-8">
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-8">
          <div className="flex flex-col items-center">
            <div className="relative">
              <img
                src={merchant?.logo || DUMMY_IMAGE}
                alt="merchant"
                className="w-32 h-32 rounded-full object-cover border-4 border-gray-100 shadow"
              />

              <label className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full cursor-pointer shadow hover:scale-105">
                <FiEdit2 size={16} />
                <input
                  type="file"
                  className="hidden"
                  onChange={() => toast.info('Logo upload demo only')}
                />
              </label>
            </div>

            <EditableField
              value={merchant?.name || ''}
              editing={editing.name}
              onEdit={() => toggleEdit('name')}
              onChange={(val) => handleChange('name', val)}
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
              value={merchant?.phone || ''}
              editing={editing.phone}
              onEdit={() => toggleEdit('phone')}
              onChange={(val) => handleChange('phone', val)}
            />

            <ProfileRow
              label="Address"
              value={merchant?.address || ''}
              editing={editing.address}
              onEdit={() => toggleEdit('address')}
              onChange={(val) => handleChange('address', val)}
            />
            <div className="pt-8 mt-8">
              <h3 className="text-lg font-semibold mb-4">Documents</h3>

              <div className="space-y-4">
                <DocumentUploadRow
                  label="Docs"
                  file={merchant?.documents?.docs}
                  onUpload={(file) => handleDocumentUpload('pan', file)}
                />
              </div>
            </div>
          </div>

          <div className="mt-10 flex justify-center">
            <button
              onClick={handleUpdate}
              disabled={loading}
              className="bg-primary text-white px-8 py-3 rounded-lg shadow hover:opacity-90"
            >
              {loading ? 'Updating...' : 'Update Profile'}
            </button>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default ProfileSetting;

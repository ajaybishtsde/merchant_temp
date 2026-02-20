import { useEffect, useRef, useState } from 'react';
import DefaultLayout from '@/layout/DefaultLayout';
import BreadCrumb from '@/components/common/ui/BreadCrumb';
import { toast } from 'react-toastify';
import { FiEdit2 } from 'react-icons/fi';
import { DocumentUploadRow, ProfileRow } from './components';
import { MerchantAPI } from '@/utils/api/merchant.api';
import companyLogo from '@/static/images/user/company-logo.png';
import { Controller, useForm } from 'react-hook-form';
import LoadingButton from '@/components/common/LoadingButton';

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
interface ProfileFormData {
  email: string;
  contact_person: string;
  contact_number: string;
  company_address: string;
}

const ProfileSetting = () => {
  const [merchant, setMerchant] = useState<IMerchantProfile | null>(null);
  const [logoLoading, setLogoLoading] = useState(false);
  const [docLoading, setDocLoading] = useState(false);
  const docInputRef = useRef<HTMLInputElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  // track which fields are editable
  const [editing, setEditing] = useState<Record<string, boolean>>({});
  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<ProfileFormData>();

  const toggleEdit = (field: string) => {
    setEditing((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const fetchMerchantProfile = async () => {
    try {
      const res = await MerchantAPI.getProfile();

      if (res.status) {
        setMerchant(res.result);

        reset({
          email: res.result.email,
          contact_person: res.result.contact_person,
          contact_number: res.result.contact_number,
          company_address: res.result.company_address,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDocumentUpload = async (file?: File) => {
    if (!file || !merchant) return;

    if (file.type !== 'application/pdf') {
      toast.error('Only PDF files are allowed');
      if (docInputRef.current) docInputRef.current.value = '';
      return;
    }

    try {
      setDocLoading(true);

      const res = await MerchantAPI.updateDocs(file);

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

  const onSubmit = async (data: ProfileFormData) => {
    try {
      const formData = new FormData();

      formData.append('contact_person', data.contact_person);
      formData.append('contact_number', data.contact_number);
      formData.append('company_address', data.company_address);

      await MerchantAPI.updateProfile(formData);

      toast.success('Profile Updated Successfully');

      setEditing({});
    } catch {
      toast.error('Failed to update profile');
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

      const res = await MerchantAPI.updateLogo(file);

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
                src={merchant?.company_logo || companyLogo}
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

            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <div className="flex flex-col gap-1">
                  <p className="font-medium text-xl text-black bg-gray-50 p-3 rounded-lg">
                    {field.value || '-'}
                  </p>
                </div>
              )}
            />
          </div>

          <div className="border-t my-8" />

          <div className="space-y-5">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <Controller
                name="contact_person"
                control={control}
                rules={{
                  required: 'Name is required',
                  validate: (value) => value?.trim() !== '' || 'Name cannot be empty',
                }}
                render={({ field, fieldState }) => (
                  <ProfileRow
                    label="Name"
                    value={field.value}
                    editing={editing.name}
                    onEdit={() => toggleEdit('name')}
                    onChange={field.onChange}
                    error={fieldState.error?.message}
                  />
                )}
              />

              <Controller
                name="contact_number"
                control={control}
                rules={{
                  required: 'Phone is required',
                  validate: (value) => value?.trim() !== '' || 'Phone cannot be empty',
                }}
                render={({ field, fieldState }) => (
                  <ProfileRow
                    label="Phone"
                    value={field.value}
                    editing={editing.phone}
                    onEdit={() => toggleEdit('phone')}
                    onChange={field.onChange}
                    error={fieldState.error?.message}
                  />
                )}
              />

              <Controller
                name="company_address"
                control={control}
                rules={{
                  required: 'Address is required',
                  validate: (value) => value?.trim() !== '' || 'Address cannot be empty',
                }}
                render={({ field, fieldState }) => (
                  <ProfileRow
                    label="Address"
                    value={field.value}
                    editing={editing.address}
                    onEdit={() => toggleEdit('address')}
                    onChange={field.onChange}
                    error={fieldState.error?.message}
                  />
                )}
              />

              <div className="mt-10 flex justify-center">
                <LoadingButton
                  type="submit"
                  loading={isSubmitting}
                  className="w-full rounded-lg bg-primary text-white p-4"
                >
                  {isSubmitting ? 'Updating...' : 'Update Profile'}
                </LoadingButton>
              </div>
            </form>
            <div className="pt-8 mt-8">
              <h3 className="text-lg font-semibold mb-4 text-black">Documents</h3>

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

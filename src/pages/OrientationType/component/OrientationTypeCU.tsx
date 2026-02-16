import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import BaseModal from '@/components/common/model';
import {
  IOrientationType,
  NewOrientationType,
  OrientationTypeAPI,
} from '@/utils/api/orientationtype.api';

interface OrientationTypeCUProps {
  isOpen: boolean;
  toggleModal: () => void;
  fetchLatestData: () => void;
  updateData?: IOrientationType;
}

const OrientationTypeCU: React.FC<OrientationTypeCUProps> = ({
  isOpen,
  toggleModal,
  fetchLatestData,
  updateData,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NewOrientationType>({
    defaultValues: updateData
      ? {
          name: updateData.name,
          name_ja: updateData.name_ja,
          name_zh: updateData.name_zh,
          name_es: updateData.name_es,
        }
      : {},
  });

  const onSubmit = async (data: NewOrientationType) => {
    try {
      const formData = {
        ...data,
      };
      // API call for either creating or updating the OrientationType
      const res = updateData?.id
        ? await OrientationTypeAPI.update(updateData.id, formData)
        : await OrientationTypeAPI.create(formData);

      if (res.status) {
        toast.success(res.message, {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000,
        });
        fetchLatestData();
        toggleModal();
      }
    } catch (error: any) {
      console.log('error: ', error);
      toast.error(error.message || 'Something went wrong', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 1000,
      });
    }
  };

  return (
    <div className="container mx-auto rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <BaseModal isOpen={isOpen} toggleModal={toggleModal} heading="OrientationType">
        <div className="w-full p-4">
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Name Input */}
            <div className="mb-4">
              <label className="mb-2.5 block font-medium">Enter Name</label>
              <input
                type="text"
                placeholder="Enter OrientationType Name"
                {...register('name', { required: true })}
                className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
              {errors.name && <div className="text-sm text-red-600">Name is required</div>}
            </div>
            <div className="mb-4">
              <label className="mb-2.5 block font-medium">Enter Name (Japanese)</label>
              <input
                type="text"
                placeholder="Enter RomanceType Name in Japanese"
                {...register('name_ja')}
                className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
            </div>
            <div className="mb-4">
              <label className="mb-2.5 block font-medium">Enter Name (Chinese)</label>
              <input
                type="text"
                placeholder="Enter RomanceType Name in Chinese"
                {...register('name_zh')}
                className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
            </div>
            <div className="mb-4">
              <label className="mb-2.5 block font-medium">Enter Name (Spanish)</label>
              <input
                type="text"
                placeholder="Enter RomanceType Name in Spanish"
                {...register('name_es')}
                className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
            </div>

            {/* Submit Button */}
            <div className="mb-5">
              <input
                type="submit"
                value="Submit"
                className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90"
              />
            </div>
          </form>
        </div>
      </BaseModal>
    </div>
  );
};

export default OrientationTypeCU;

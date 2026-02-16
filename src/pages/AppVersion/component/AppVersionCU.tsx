import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import BaseModal from '@/components/common/model';
import { AppVersionAPI, IAppVersion, NewAppVersion } from '@/utils/api/appVersion.api';
import SwitchInput from '@/components/ui/Switch';

interface AppVersionCUProps {
  isOpen: boolean;
  toggleModal: () => void;
  fetchLatestData: () => void;
  updateData?: IAppVersion;
}

const AppVersionCU: React.FC<AppVersionCUProps> = ({
  isOpen,
  toggleModal,
  fetchLatestData,
  updateData,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NewAppVersion>({
    defaultValues: updateData
      ? {
          platform: updateData.platform,
          version: updateData.version,
          build: updateData.build,
          isForceUpdateRequire: updateData.isForceUpdateRequire,
        }
      : {},
  });
  const [isForceUpdateRequire, setIsForceUpdateRequire] = useState(
    updateData?.isForceUpdateRequire ?? false,
  );

  const onSubmit = async (appVersion: NewAppVersion) => {
    try {
      const data = { ...appVersion, isForceUpdateRequire };
      const res = updateData?.id
        ? await AppVersionAPI.update(updateData.id, data)
        : await AppVersionAPI.create(data);

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
      <BaseModal isOpen={isOpen} toggleModal={toggleModal} heading="App Version">
        <div className="w-full p-4">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
              <label className="mb-2.5 block font-medium">Enter Platform</label>
              <select
                {...register('platform')}
                className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
              >
                <option value="">Select Platform</option>
                <option value="IOS">iOS</option>
                <option value="ANDROID">Android</option>
              </select>
              {errors.platform && <div className="text-sm text-red-600">Platform is required</div>}
            </div>

            <div className="mb-4">
              <label className="mb-2.5 block font-medium">Enter version</label>
              <input
                type="text"
                placeholder="Enter version"
                {...register('version', { required: true })}
                className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
              {errors.version && <div className="text-sm text-red-600">version is required</div>}
            </div>

            <div className="mb-4">
              <label className="mb-2.5 block font-medium">Enter build</label>
              <input
                type="number"
                placeholder="Enter build"
                {...register('build', { required: true, valueAsNumber: true })}
                className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
              {errors.build && <div className="text-sm text-red-600">build is required</div>}
            </div>

            <div className="mb-4">
              <label className="mb-2.5 block font-medium">Is Force Update required?</label>
              <SwitchInput
                initialValue={isForceUpdateRequire}
                onChange={(e) => setIsForceUpdateRequire(e)}
              />
            </div>

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

export default AppVersionCU;

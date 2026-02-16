import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import BaseModal from '@/components/common/model';
import { IUser, UpdateToggles, UserAPI, UserWalkthroughToggles } from '@/utils/api/user.api';

interface UserCUProps {
  isOpen: boolean;
  toggleModal: () => void;
  fetchLatestData: () => void;
  data: IUser;
}

const TOGGLE_FIELDS: (keyof UserWalkthroughToggles['walkthrough'])[] = [
  'notification',
  'drop_in',
  'timer',
  'drop_out',
  'edit_status',
  'drop_in_note',
  'filter_button',
  'squad',
  'share_location_with_squad',
  'share_experience',
  'places_functions',
  'share_4rl',
  'not_in_neighborhood',
  'notification_bell',
  'heat_map',
  'share_deets_screen_experiences',
  'moga_store',
] as const;

const UserCU: React.FC<UserCUProps> = ({ isOpen, toggleModal, fetchLatestData, data }) => {
  const { register, handleSubmit, setValue, watch } = useForm<Record<string, boolean>>();

  useEffect(() => {
    if (isOpen) fetchUserData();
  }, [isOpen]);

  const fetchUserData = async () => {
    try {
      const user = await UserAPI.get(data.user_id);
      console.log('user: ', user);
      TOGGLE_FIELDS.forEach((field) => {
        setValue(field, user.result[field] ?? false);
      });
      setValue('isMembersOnlyEnabled', data.isMembersOnlyEnabled);
    } catch (err) {
      console.error('error: ', err);
      toast.error('Failed to load user toggles');
    } finally {
    }
  };

  const onSubmit = async (updateData: any) => {
    try {
      console.log('Update data: ', updateData);
      const formatted: UpdateToggles = {
        walkthroughToggles: TOGGLE_FIELDS.map((key) => ({
          key,
          value: updateData[key],
        })),
        isMembersOnlyEnabled: updateData.isMembersOnlyEnabled,
      };
      console.log('formatted: ', formatted);

      const res = await UserAPI.update(data.user_id, formatted);
      toast.success(res.message, { position: toast.POSITION.TOP_RIGHT, autoClose: 1000 });
      fetchLatestData();
      toggleModal();
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 1000,
      });
    }
  };

  return (
    <div className="container mx-auto rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <BaseModal
        isOpen={isOpen}
        toggleModal={toggleModal}
        heading={`${data.user_firstName} ${data.user_lastName}`}
      >
        <div className="w-full p-4">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="pb-4">
              <div className="mb-4 p-3 text-lg font-bold">User Walkthrough Toggles</div>

              {TOGGLE_FIELDS.map((field) => (
                <div key={field} className="flex items-center justify-between p-3">
                  <label className="capitalize">{field.replace(/_/g, ' ')}</label>
                  <div
                    className={`relative w-12 h-6 bg-gray-200 rounded-full cursor-pointer ${watch(field) ? 'bg-blue-600' : 'bg-slate-200'}`}
                    onClick={() => {
                      const newValue = !watch(field);
                      setValue(field, newValue, { shouldDirty: true });
                    }}
                  >
                    <input
                      type="checkbox"
                      {...register(field)}
                      checked={watch(field)}
                      className="hidden"
                    />
                    <div
                      className={`absolute left-0 top-0 w-6 h-6 bg-white rounded-full shadow-md transform transition-transform ${watch(field) ? 'translate-x-full' : ''}`}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="pb-4">
              <div className="mb-4 p-3 text-lg font-bold">Members Only?</div>
              <div key="isMembersOnlyEnabled" className="flex items-center justify-between p-3">
                <label className="capitalize">Is Members Only Enabled ?</label>
                <div
                  className={`relative w-12 h-6 bg-gray-200 rounded-full cursor-pointer ${watch('isMembersOnlyEnabled') ? 'bg-blue-600' : 'bg-slate-200'}`}
                  onClick={() => {
                    const newValue = !watch('isMembersOnlyEnabled');
                    setValue('isMembersOnlyEnabled', newValue, { shouldDirty: true });
                  }}
                >
                  <input
                    type="checkbox"
                    {...register('isMembersOnlyEnabled')}
                    checked={watch('isMembersOnlyEnabled')}
                    className="hidden"
                  />
                  <div
                    className={`absolute left-0 top-0 w-6 h-6 bg-white rounded-full shadow-md transform transition-transform ${watch('isMembersOnlyEnabled') ? 'translate-x-full' : ''}`}
                  />
                </div>
              </div>
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

export default UserCU;

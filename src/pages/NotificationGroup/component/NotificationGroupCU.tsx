import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import BaseModal from '@/components/common/model';
import {
  INotificationGroup,
  NewNotificationGroup,
  NotificationGroupAPI,
} from '@/utils/api/notification-group.api';
import { UserAPI, UserResponse } from '@/utils/api/user.api';
import Select from 'react-select';

interface NotificationGroupCUProps {
  isOpen: boolean;
  toggleModal: () => void;
  fetchLatestData: () => void;
  updateData?: INotificationGroup;
}

const NotificationGroupCU: React.FC<NotificationGroupCUProps> = ({
  isOpen,
  toggleModal,
  fetchLatestData,
  updateData,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<NewNotificationGroup>({
    defaultValues: updateData
      ? {
          name: updateData.name,
          users: updateData.users,
        }
      : {},
  });
  const [users, setUsers] = useState<UserResponse>({ count: 0, data: [] });

  const fetchAllUsers = async () => {
    try {
      const res = await UserAPI.all({ includeTestUsers: true });
      if (res.status) {
        setUsers(res.result);
      }
    } catch (error) {
      console.log('error fetching users: ', error);
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const userOptions = users.data.map((user) => ({
    label: `${user.user_firstName} ${user.user_lastName}`,
    value: user.user_id,
  }));

  const onSubmit = async (data: NewNotificationGroup) => {
    try {
      const formData = {
        ...data,
      };
      console.log('data: ', data);
      const res = updateData?.id
        ? await NotificationGroupAPI.update(updateData.id, formData)
        : await NotificationGroupAPI.create(formData);

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
      <BaseModal isOpen={isOpen} toggleModal={toggleModal} heading="Notification Group">
        <div className="w-full p-4">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
              <label className="mb-2.5 block font-medium">Enter Group Name</label>
              <input
                type="text"
                placeholder="Enter NotificationGroup Name"
                {...register('name', { required: true })}
                className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
              {errors.name && <div className="text-sm text-red-600">Group Name is required</div>}
            </div>

            <div className="mb-4">
              <label className="mb-2.5 block font-medium">Select Users</label>
              <Controller
                name="users"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={userOptions}
                    isMulti
                    className="react-select-container"
                    classNamePrefix="react-select"
                    closeMenuOnSelect={false}
                  />
                )}
              />
              {errors['users'] && <div className="text-sm text-red-600">Users are required</div>}
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

export default NotificationGroupCU;

import React from 'react';
import { MdDelete, MdRemoveRedEye } from 'react-icons/md';
import DeleteAlertModel from '@/components/common/model/DeleteAlertModel';
import { toast } from 'react-toastify';
import { IUser, UserAPI } from '@/utils/api/user.api';
import UserCU from './UserCU';

interface UserTableActionProps {
  data: IUser;
  fetchUsers: () => void;
}

const UserTableAction: React.FC<UserTableActionProps> = ({
  data,
  fetchUsers,
}) => {
  const [isDeleteUser, setIsDeleteUser] = React.useState<boolean>(false);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [isForEdit, setIsForEdit] = React.useState<boolean>(false);

  const toggleEditModel = () => {
    setIsForEdit(!isForEdit);
  };

  const toggleDeleteAlertModel = () => {
    setIsDeleteUser(!isDeleteUser);
  };
  const handleDeleteUser = async () => {
    try {
      setIsLoading(true);
      const res = await UserAPI.delete(data.user_id);
      if (res.status) {
        toast.success(res.message, {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000,
        });
        fetchUsers();
      }
      setIsLoading(false);
    } catch (error: any) {
      setIsLoading(false);
      toast.error(error?.message || 'Something went wrong', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 1000,
      });
    } finally {
      setIsDeleteUser(false);
    }
  };

  return (
    <div>
      {isDeleteUser && (
        <DeleteAlertModel
          isOpen={isDeleteUser}
          onDelete={handleDeleteUser}
          toggleModal={toggleDeleteAlertModel}
          deleteFor={'User'}
          isDeleting={isLoading}
        />
      )}
      {isForEdit && (
        <UserCU
          isOpen={isForEdit}
          toggleModal={toggleEditModel}
          fetchLatestData={fetchUsers}
          data={data}
        />
      )}
      <div className="flex gap-x-3 whitespace-nowrap capitalize mt-1">
        <button
          className="bg-gray-500 hover:bg-gray-700 font-bold rounded bg-blue-600 text-white p-1"
          onClick={toggleEditModel}
        >
          <MdRemoveRedEye className="text-xl" />
        </button>
        <button
          className="hover:bg-red-500 font-bold rounded bg-red-600 text-white p-1"
          onClick={toggleDeleteAlertModel}
        >
          <MdDelete className="text-xl" />
        </button>
      </div>
    </div>
  );
};

export default UserTableAction;

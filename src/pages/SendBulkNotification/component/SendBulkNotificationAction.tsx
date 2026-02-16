import React from 'react';
import { MdDelete } from 'react-icons/md';
import DeleteAlertModel from '@/components/common/model/DeleteAlertModel';
import { toast } from 'react-toastify';
import { IBulkNotification, SendBulkNotificationAPI } from '@/utils/api/send-bulk-notification.api';

interface SendBulkNotificationProps {
  data: IBulkNotification;
  fetchSendBulkNotification: () => void;
}

const SendBulkNotificationAction: React.FC<SendBulkNotificationProps> = ({
  data,
  fetchSendBulkNotification,
}) => {
  const [isDeleteUser, setIsDeleteUser] = React.useState<boolean>(false);

  const toggleDeleteAlertModel = () => {
    setIsDeleteUser(!isDeleteUser);
  };

  const handleDeleteSendBulkNotification = () => {
    SendBulkNotificationAPI.delete(data.id)
      .then(() => {
        toast.success('Deleted Successfully');
        fetchSendBulkNotification();
        setIsDeleteUser(false);
      })
      .catch((error) => {
        toast.error(error.message);
        console.log(error);
        setIsDeleteUser(false);
      });
  };

  return (
    <div>
      {isDeleteUser && (
        <DeleteAlertModel
          isOpen={isDeleteUser}
          onDelete={handleDeleteSendBulkNotification}
          toggleModal={toggleDeleteAlertModel}
          deleteFor={'Bulk Notification'}
        />
      )}
      <div className="flex gap-x-3 whitespace-nowrap capitalize mt-1">
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

export default SendBulkNotificationAction;

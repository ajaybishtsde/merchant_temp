import React from 'react';
import { MdModeEdit } from 'react-icons/md';
import AdminMessageCU from './AdminMessageCU';
import { IAdminMessage } from '@/utils/api/admin-message.api';

interface OpenActionProps {
    data: IAdminMessage;
    fetchAdminMessage: () => void;
}

const AdminMessageAction: React.FC<OpenActionProps> = ({ data, fetchAdminMessage }) => {
    const [isForEdit, setIsForEdit] = React.useState<boolean>(false);

    const toggleEditModel = () => {
        setIsForEdit(!isForEdit);
    };

    return (
        <div>
            {isForEdit && (
                <AdminMessageCU
                    isOpen={isForEdit}
                    toggleModal={toggleEditModel}
                    fetchLatestData={fetchAdminMessage}
                    updateData={data}
                />
            )}
            <div className="flex gap-x-3 whitespace-nowrap capitalize mt-1">
                <button
                    className="bg-gray-500 hover:bg-gray-700 font-bold rounded bg-blue-600 text-white p-1"
                    onClick={toggleEditModel}
                >
                    <MdModeEdit className="text-xl" />
                </button>
            </div>
        </div>
    );
};

export default AdminMessageAction;

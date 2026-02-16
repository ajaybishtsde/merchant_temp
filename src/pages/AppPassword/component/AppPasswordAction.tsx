import React from 'react';
import { MdDelete, MdModeEdit } from 'react-icons/md';
import AppPasswordCU from './AppPasswordCU';
import { AppPasswordAPI, IAppPassword } from '@/utils/api/app-password.api';
import DeleteAlertModel from '@/components/common/model/DeleteAlertModel';
import { toast } from 'react-toastify';

interface OpenActionProps {
    data: IAppPassword;
    fetchAppPassword: () => void;
}

const AppPasswordAction: React.FC<OpenActionProps> = ({ data, fetchAppPassword }) => {
    const [isDeleteAppPassword, setIsDeleteAppPassword] = React.useState<boolean>(false);
    const [isForEdit, setIsForEdit] = React.useState<boolean>(false);

    const toggleEditModel = () => {
        setIsForEdit(!isForEdit);
    };

    const toggleDeleteAlertModel = () => {
        setIsDeleteAppPassword(!isDeleteAppPassword);
    };

    const handleDeleteAppVersion = () => {
        AppPasswordAPI.delete(data.id).then(() => {
            toast.success('Deleted Successfully');
            fetchAppPassword();
            setIsDeleteAppPassword(false);
        }).catch((error) => {
            toast.error(error.message)
            console.log(error)
            setIsDeleteAppPassword(false)
        });
    };

    return (
        <div>
            {isDeleteAppPassword && (
                <DeleteAlertModel
                    isOpen={isDeleteAppPassword}
                    onDelete={handleDeleteAppVersion}
                    toggleModal={toggleDeleteAlertModel}
                    deleteFor={'AppVersion'}
                />
            )}
            {isForEdit && (
                <AppPasswordCU
                    isOpen={isForEdit}
                    toggleModal={toggleEditModel}
                    fetchLatestData={fetchAppPassword}
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

export default AppPasswordAction;

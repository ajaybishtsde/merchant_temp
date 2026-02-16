import React from 'react';
import { MdDelete, MdModeEdit } from 'react-icons/md';
import AddNewAdmin from './AddNewAdmin';
import DeleteAlertModel from '../common/model/DeleteAlertModel';
import { toast } from 'react-toastify';
import { AdminAPI, IAdmin } from '@/utils/api/admin.api';

interface AdminTableActionProps {
    data: IAdmin;
    fetchAdmins: () => void;
}

const AdminTableAction: React.FC<AdminTableActionProps> = ({ data, fetchAdmins }) => {
    const [isEditAdmin, setIsEditAdmin] = React.useState<boolean>(false)
    const [isDeleteAdmin, setIsDeleteAdmin] = React.useState<boolean>(false)
    const [isDeleting, setIsDeleting] = React.useState<boolean>(false)



    const toggleModal = () => {
        setIsEditAdmin(!isEditAdmin);
    }

    const toggleDeleteAlertModel = () => {
        setIsDeleteAdmin(!isDeleteAdmin)
    }

    const handleDeleteAdmin = async () => {
        try {
            setIsDeleting(true)
            const res = await AdminAPI.deleteById(data.id)
            if (res.status) {
                toast.success(res.message, {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 1000,

                });
                fetchAdmins();
            }
        } catch (error: any) {
            setIsDeleting(false);
            setIsDeleteAdmin(false)
            toast.error(error.message || 'Something went wrong', {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 1000,
            });

        } finally {
            setIsDeleting(false);
        }
    }



    return (
        <div>
            {isDeleteAdmin && <DeleteAlertModel isDeleting={isDeleting} isOpen={isDeleteAdmin} onDelete={handleDeleteAdmin} toggleModal={toggleDeleteAlertModel} deleteFor='admin' />}
            {isEditAdmin && <AddNewAdmin isOpen={isEditAdmin} toggleModal={toggleModal} fetchAdmins={fetchAdmins} updateAdminData={data} />}
            <div className="flex gap-x-3 whitespace-nowrap capitalize mt-1 items-center h-full">
                <button
                    className="bg-gray-500 hover:bg-gray-700 font-bold rounded bg-blue-600 text-white p-1"
                    onClick={toggleModal}
                >
                    <MdModeEdit className="text-xl" />
                </button>
                <button
                    className="hover:bg-red-500 font-bold rounded bg-red-600 text-white p-1"
                    onClick={toggleDeleteAlertModel}
                >
                    {isDeleting ? "Deleting..." : <MdDelete className="text-xl" />}
                </button>
            </div>
        </div>
    );
};

export default AdminTableAction;

import React from 'react';
import { IWaitlist, WaitlistAPI } from "@/utils/api/waitlist.api"
import { toast } from 'react-toastify';
import DeleteAlertModel from '@/components/common/model/DeleteAlertModel';
import { MdDelete } from 'react-icons/md';
import ConfirmUserWaitlistModel from '@/components/common/model/ConfirmWaitlistUser';

interface OpenActionProps {
    data: IWaitlist;
    fetchWaitlist: () => void;
}

const WaitlistAction: React.FC<OpenActionProps> = ({ data, fetchWaitlist }) => {
    const [isDeleteWaitlist, setIsDeleteWaitlist] = React.useState<boolean>(false);

    const [isForEdit, setIsForEdit] = React.useState<boolean>(false);

    const toggleEditModel = () => {
        setIsForEdit(!isForEdit);
    };

    const toggleDeleteAlertModel = () => {
        setIsDeleteWaitlist(!isDeleteWaitlist);
    };

    const handleDeleteWaitlist = () => {
        WaitlistAPI.delete(data.id).then(() => {
            toast.success('Deleted Successfully');
            fetchWaitlist();
            setIsDeleteWaitlist(false);
        }).catch((error) => {
            toast.error(error.message)
            console.log(error)
            setIsDeleteWaitlist(false)
        });
    }

    const onSubmit = async () => {
        try {
            const res = await WaitlistAPI.update(data.id, { status: 'accepted' })

            if (res.status) {
                toast.success(res.message, {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 1000,
                });
                fetchWaitlist();
                toggleEditModel();
            }
        } catch (error: any) {
            console.log("error: ", error)
            toast.error(error.message || 'Something went wrong', {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 1000,
            });
        }
    };

    return (
        <div>
            {isDeleteWaitlist && (
                <DeleteAlertModel isOpen={isDeleteWaitlist} onDelete={handleDeleteWaitlist} toggleModal={toggleDeleteAlertModel} deleteFor='User from waitlist' />
            )}
            {isForEdit && (
                <ConfirmUserWaitlistModel isOpen={isForEdit} toggleModal={toggleEditModel} onAccept={onSubmit} userName={`${data.firstName} ${data.lastName}`} />
            )}
            <div className="flex justify-center gap-x-3">
                {data.status !== 'accepted' &&
                    <button
                        className="text-white bg-blue-700 hover:bg-blue-800 rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700"
                        onClick={() => setIsForEdit(true)}
                    >
                        Accept
                    </button>
                }
                <button
                    className='text-white bg-red-700 hover:bg-red-800 rounded-lg text-sm px-3 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700'
                    onClick={toggleDeleteAlertModel}
                >
                    <MdDelete className="text-xl" />
                </button>
            </div>
        </div>
    )
}

export default WaitlistAction;
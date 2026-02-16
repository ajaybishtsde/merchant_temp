import React from 'react';
import { MdDelete, MdModeEdit } from 'react-icons/md';
import DeleteAlertModel from '@/components/common/model/DeleteAlertModel';
import { toast } from 'react-toastify';
import PriceRangeCU from './PriceRangeCU';
import { PriceRangeAPI, IPriceRange } from '@/utils/api/priceRange.api';

interface PriceRangeProps {
    data: IPriceRange;
    fetchPriceRange: () => void;
}

const PriceRangeAction: React.FC<PriceRangeProps> = ({ data, fetchPriceRange }) => {
    const [isDeleteUser, setIsDeleteUser] = React.useState<boolean>(false);
    const [isForEdit, setIsForEdit] = React.useState<boolean>(false);

    const toggleEditModel = () => {
        setIsForEdit(!isForEdit);
    };

    const toggleDeleteAlertModel = () => {
        setIsDeleteUser(!isDeleteUser);
    };

    const handleDeletePriceRange = () => {
        PriceRangeAPI.delete(data.id).then(() => {
            toast.success('Deleted Successfully');
            fetchPriceRange();
            setIsDeleteUser(false);
        }).catch((error) => {
            toast.error(error.message)
            console.log(error)
            setIsDeleteUser(false)
        });
    };

    return (
        <div>
            {isDeleteUser && (
                <DeleteAlertModel
                    isOpen={isDeleteUser}
                    onDelete={handleDeletePriceRange}
                    toggleModal={toggleDeleteAlertModel}
                    deleteFor={'PriceRange'}
                    isWarningShow={true}
                />
            )}
            {isForEdit && (
                <PriceRangeCU
                    isOpen={isForEdit}
                    toggleModal={toggleEditModel}
                    fetchLatestData={fetchPriceRange}
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

export default PriceRangeAction;

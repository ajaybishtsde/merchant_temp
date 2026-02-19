import React, { useState } from 'react';
import { MdDelete, MdModeEdit } from 'react-icons/md';
import DeleteAlertModel from '@/components/common/model/DeleteAlertModel';
import PlaceCU from './PlaceCU';
import { toast } from 'react-toastify';
import { HotspotAPI, IPlaceHotspot } from '@/utils/api/hotspot.api';
interface PlaceActionProps {
  data: IPlaceHotspot;
  fetchPlace: () => void;
}

const PlaceAction: React.FC<PlaceActionProps> = ({ data, fetchPlace }) => {
  const [isDeleteUser, setIsDeleteUser] = useState<boolean>(false);
  const [isForEdit, setIsForEdit] = useState<boolean>(false);
  const toggleEditModel = () => {
    setIsForEdit(!isForEdit);
  };

  const toggleDeleteAlertModel = () => {
    setIsDeleteUser(!isDeleteUser);
  };
  const handleDeleteNeighbor = () => {
    HotspotAPI.delete(data.id, { type: data.hotspotType }).then(() => {
      toast.success('Deleted Successfully');
      fetchPlace();
      setIsDeleteUser(false);
    });
  };

  return (
    <div>
      {isDeleteUser && (
        <DeleteAlertModel
          isOpen={isDeleteUser}
          onDelete={handleDeleteNeighbor}
          toggleModal={toggleDeleteAlertModel}
          deleteFor={'Place'}
        />
      )}
      {isForEdit && (
        <PlaceCU
          isOpen={isForEdit}
          toggleModal={toggleEditModel}
          fetchLatestData={fetchPlace}
          updateData={data}
        />
      )}
      <div className="flex gap-x-3 whitespace-nowrap capitalize mt-1 ">
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

export default PlaceAction;

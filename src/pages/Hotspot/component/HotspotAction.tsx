import React, { useState } from 'react';
import { MdDelete, MdModeEdit, MdRemoveRedEye } from 'react-icons/md';
import DeleteAlertModel from '@/components/common/model/DeleteAlertModel';
import HotspotCU from './HotspotCU';
import { toast } from 'react-toastify';
import { HotspotAPI, IEventHotspot, IPlaceHotspot } from '@/utils/api/hotspot.api';
import ViewGuestList from '@/components/common/model/viewGuestList';

interface HotspotActionProps {
  data: IEventHotspot | IPlaceHotspot;
  fetchEvents: () => void;
  selectedTab: 'place' | 'event';
}

const HotspotAction: React.FC<HotspotActionProps> = ({ data, fetchEvents, selectedTab }) => {
  const [isDeleteUser, setIsDeleteUser] = useState<boolean>(false);
  const [isForEdit, setIsForEdit] = useState<boolean>(false);
  const [isViewEnabled, setIsViewEnabled] = useState(false);
  const toggleEditModel = () => {
    setIsForEdit(!isForEdit);
  };

  const toggleDeleteAlertModel = () => {
    setIsDeleteUser(!isDeleteUser);
  };
  const handleDeleteNeighbor = () => {
    HotspotAPI.delete(data.id, { type: data.hotspotType }).then(() => {
      toast.success('Deleted Successfully');
      fetchEvents();
      setIsDeleteUser(false);
    });
  };

  const toggleViewModal = () => setIsViewEnabled(!isViewEnabled);
  console.log('>>>>>>>>>>>>>', isViewEnabled);
  return (
    <div>
      {isDeleteUser && (
        <DeleteAlertModel
          isOpen={isDeleteUser}
          onDelete={handleDeleteNeighbor}
          toggleModal={toggleDeleteAlertModel}
          deleteFor={'Experience'}
        />
      )}
      {isForEdit && (
        <HotspotCU
          isOpen={isForEdit}
          toggleModal={toggleEditModel}
          fetchLatestData={fetchEvents}
          updateData={data}
        />
      )}
      {isViewEnabled && (
        <ViewGuestList isOpen={isViewEnabled} toggleModal={toggleViewModal} eventId={data?.id} />
      )}
      <div className="flex gap-x-3 whitespace-nowrap capitalize mt-1 ">
        {selectedTab === 'event' && (
          <button
            className="bg-gray-500 hover:bg-gray-700 font-bold rounded bg-blue-600 text-white p-1"
            onClick={toggleViewModal}
          >
            <MdRemoveRedEye className="text-xl" />
          </button>
        )}
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

export default HotspotAction;

import React, { useEffect, useState } from 'react';
import DefaultLayout from '@/layout/DefaultLayout';
import { toast } from 'react-toastify';
import SwitchInput from '@/components/ui/Switch';
import BreadCrumb from '@/components/common/ui/BreadCrumb';
import { AgGridReact } from 'ag-grid-react';
import Pagination from '@/components/common/ui/PaginationFooter';
import {
  INotificationGroup,
  NotificationGroupAPI,
  NotificationGroupResponse,
} from '@/utils/api/notification-group.api';
import NotificationGroupAction from './component/NotificationGroupAction';
import NotificationGroupCU from './component/NotificationGroupCU';

const NotificationGroup = () => {
  const [isAddNotificationGroup, setIsAddNotificationGroup] = useState<boolean>(false);
  const [NotificationGroup, setNotificationGroup] = useState<NotificationGroupResponse>({
    count: 0,
    data: [],
  });

  const toggleModal = () => {
    setIsAddNotificationGroup(!isAddNotificationGroup);
  };

  const fetchNotificationGroup = async () => {
    try {
      const res = await NotificationGroupAPI.getAll();
      console.log('res: ', res);
      if (res.status) {
        setNotificationGroup(res.result);
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  useEffect(() => {
    fetchNotificationGroup();
  }, []);

  const colDefs: any = [
    { field: 'name', headerName: 'Name', flex: 1, sortable: true },
    {
      field: 'isActive',
      headerName: 'Status',
      flex: 0.5,
      sortable: true,
      cellRenderer: (params: { data: INotificationGroup }) => {
        const active = params?.data?.isActive as boolean;
        const handleSwitchChange = (newValue: boolean) => {
          NotificationGroupAPI.updateStatus(params.data.id, newValue).then(() => {
            toast.success('Updated Successfully');
            fetchNotificationGroup();
          });
        };
        return (
          <div className="flex items-center h-full">
            <SwitchInput initialValue={active} onChange={handleSwitchChange} />
          </div>
        );
      },
    },
    {
      field: 'isEnabled',
      headerName: 'Actions',
      flex: 0.5,
      sortable: true,
      cellRenderer: (params: { data: INotificationGroup }) => {
        return (
          <NotificationGroupAction
            data={params.data}
            fetchNotificationGroup={fetchNotificationGroup}
          />
        );
      },
    },
  ];
  return (
    <DefaultLayout>
      {isAddNotificationGroup && (
        <NotificationGroupCU
          isOpen={isAddNotificationGroup}
          toggleModal={toggleModal}
          fetchLatestData={fetchNotificationGroup}
        />
      )}
      <div>
        <BreadCrumb pageName="Notification Group" />
        <div className="flex gap-4 mb-8 justify-end">
          <button>
            <h4
              className="text-xl rounded border bg-blue-500 text-gray px-5 py-1"
              onClick={toggleModal}
            >
              {'Add New Notification Group'}
            </h4>
          </button>
        </div>

        <div className="w-full h-full">
          <div className="ag-theme-quartz h-[500px] pb-4">
            <AgGridReact className="w-full" rowData={NotificationGroup.data} columnDefs={colDefs} />
          </div>
          <div className="relative z-1 -mt-4">
            {NotificationGroup?.count > 0 && (
              <Pagination getRequestData={fetchNotificationGroup} total={NotificationGroup.count} />
            )}
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default NotificationGroup;

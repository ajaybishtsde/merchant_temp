import React, { useEffect, useState } from 'react';
import DefaultLayout from '@/layout/DefaultLayout';
import { toast } from 'react-toastify';
import SwitchInput from '@/components/ui/Switch';
import BreadCrumb from '@/components/common/ui/BreadCrumb';
import { AgGridReact } from 'ag-grid-react';
import Pagination from '@/components/common/ui/PaginationFooter';
import OrientationTypeCU from './component/OrientationTypeCU';
import {
  IOrientationType,
  OrientationTypeAPI,
  OrientationTypeResponse,
} from '@/utils/api/orientationtype.api';
import OrientationTypeAction from './component/OrientationtypeAction';

const OrientationType = () => {
  const [isAddOrientationType, setIsAddOrientationType] = useState<boolean>(false);
  const [OrientationType, setOrientationType] = useState<OrientationTypeResponse>({
    count: 0,
    data: [],
  });

  const toggleModal = () => {
    setIsAddOrientationType(!isAddOrientationType);
  };

  const fetchOrientationType = async () => {
    try {
      const res = await OrientationTypeAPI.getAll();
      console.log('res: ', res);
      if (res.status) {
        setOrientationType(res.result);
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  useEffect(() => {
    fetchOrientationType();
  }, []);

  const colDefs: any = [
    { field: 'name', headerName: 'Name', flex: 1, sortable: true },
    { field: 'name_ja', headerName: 'Name(Japanese)', flex: 1, sortable: true },
    { field: 'name_zh', headerName: 'Name(Chinese)', flex: 1, sortable: true },
    { field: 'name_es', headerName: 'Name(Spanish)', flex: 1, sortable: true },
    {
      field: 'isActive',
      headerName: 'Status',
      flex: 0.5,
      sortable: true,
      cellRenderer: (params: { data: IOrientationType }) => {
        const active = params?.data?.isActive as boolean;
        const handleSwitchChange = (newValue: boolean) => {
          OrientationTypeAPI.updateStatus(params.data.id, newValue).then(() => {
            toast.success('Updated Successfully');
            fetchOrientationType();
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
      cellRenderer: (params: { data: IOrientationType }) => {
        return (
          <OrientationTypeAction data={params.data} fetchOrientationType={fetchOrientationType} />
        );
      },
    },
  ];
  return (
    <DefaultLayout>
      {isAddOrientationType && (
        <OrientationTypeCU
          isOpen={isAddOrientationType}
          toggleModal={toggleModal}
          fetchLatestData={fetchOrientationType}
        />
      )}
      <div>
        <BreadCrumb pageName="OrientationType" />
        <div className="flex gap-4 mb-8 justify-end">
          <button>
            <h4
              className="text-xl rounded border bg-blue-500 text-gray px-5 py-1"
              onClick={toggleModal}
            >
              {'Add New OrientationType'}
            </h4>
          </button>
        </div>

        <div className="w-full h-full">
          <div className="ag-theme-quartz h-[500px] pb-4">
            <AgGridReact className="w-full" rowData={OrientationType.data} columnDefs={colDefs} />
          </div>
          <div className="relative z-1 -mt-4">
            {OrientationType?.count > 0 && (
              <Pagination getRequestData={fetchOrientationType} total={OrientationType.count} />
            )}
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default OrientationType;

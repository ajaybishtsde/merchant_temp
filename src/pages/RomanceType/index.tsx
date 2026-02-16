import React, { useEffect, useState } from 'react';
import DefaultLayout from '@/layout/DefaultLayout';
import { IRomanceType, RomanceTypeAPI, RomanceTypeResponse } from '@/utils/api/romancetype.api';
import { toast } from 'react-toastify';
import SwitchInput from '@/components/ui/Switch';
import RomanceTypeCU from './component/RomanceTypeCU';
import BreadCrumb from '@/components/common/ui/BreadCrumb';
import { AgGridReact } from 'ag-grid-react';
import Pagination from '@/components/common/ui/PaginationFooter';
import RomanceTypeAction from './component/RomanceTypeAction';

const RomanceType = () => {
  const [isAddRomanceType, setIsAddRomanceType] = useState<boolean>(false);
  const [romanceType, setRomanceType] = useState<RomanceTypeResponse>({
    count: 0,
    data: [],
  });

  const toggleModal = () => {
    setIsAddRomanceType(!isAddRomanceType);
  };

  const fetchRomanceType = async () => {
    try {
      const res = await RomanceTypeAPI.getAll();
      if (res.status) {
        setRomanceType(res.result);
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  useEffect(() => {
    fetchRomanceType();
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
      cellRenderer: (params: { data: IRomanceType }) => {
        const active = params?.data?.isActive as boolean;
        const handleSwitchChange = (newValue: boolean) => {
          RomanceTypeAPI.updateStatus(params.data.id, newValue).then(() => {
            toast.success('Updated Successfully');
            fetchRomanceType();
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
      cellRenderer: (params: { data: IRomanceType }) => {
        return <RomanceTypeAction data={params.data} fetchRomanceType={fetchRomanceType} />;
      },
    },
  ];
  return (
    <DefaultLayout>
      {isAddRomanceType && (
        <RomanceTypeCU
          isOpen={isAddRomanceType}
          toggleModal={toggleModal}
          fetchLatestData={fetchRomanceType}
        />
      )}
      <div>
        <BreadCrumb pageName="RomanceType" />
        <div className="flex gap-4 mb-8 justify-end">
          <button>
            <h4
              className="text-xl rounded border bg-blue-500 text-gray px-5 py-1"
              onClick={toggleModal}
            >
              {'Add New RomanceType'}
            </h4>
          </button>
        </div>

        <div className="w-full h-full">
          <div className="ag-theme-quartz h-[500px] pb-4">
            <AgGridReact className="w-full" rowData={romanceType.data} columnDefs={colDefs} />
          </div>
          <div className="relative z-1 -mt-4">
            {romanceType?.count > 0 && (
              <Pagination getRequestData={fetchRomanceType} total={romanceType.count} />
            )}
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default RomanceType;

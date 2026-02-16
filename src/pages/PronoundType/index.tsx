import React, { useEffect, useState } from 'react';
import DefaultLayout from '@/layout/DefaultLayout';
import { toast } from 'react-toastify';
import SwitchInput from '@/components/ui/Switch';
import BreadCrumb from '@/components/common/ui/BreadCrumb';
import { AgGridReact } from 'ag-grid-react';
import Pagination from '@/components/common/ui/PaginationFooter';
import PronounsTypeCU from './component/PronounsTypeCU';
import { IPronounsType, PronounsTypeAPI, PronounsTypeResponse } from '@/utils/api/pronounstype.api';
import PronounsTypeAction from './component/PronounsTypeAction';

const PronounsType = () => {
  const [isAddPronounsType, setIsAddPronounsType] = useState<boolean>(false);
  const [PronounsType, setPronounsType] = useState<PronounsTypeResponse>({
    count: 0,
    data: [],
  });

  const toggleModal = () => {
    setIsAddPronounsType(!isAddPronounsType);
  };

  const fetchPronounsType = async () => {
    try {
      const res = await PronounsTypeAPI.getAll();
      console.log('res: ', res);
      if (res.status) {
        setPronounsType(res.result);
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  useEffect(() => {
    fetchPronounsType();
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
      cellRenderer: (params: { data: IPronounsType }) => {
        const active = params?.data?.isActive as boolean;
        const handleSwitchChange = (newValue: boolean) => {
          PronounsTypeAPI.updateStatus(params.data.id, newValue).then(() => {
            toast.success('Updated Successfully');
            fetchPronounsType();
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
      cellRenderer: (params: { data: IPronounsType }) => {
        return <PronounsTypeAction data={params.data} fetchPronounsType={fetchPronounsType} />;
      },
    },
  ];
  return (
    <DefaultLayout>
      {isAddPronounsType && (
        <PronounsTypeCU
          isOpen={isAddPronounsType}
          toggleModal={toggleModal}
          fetchLatestData={fetchPronounsType}
        />
      )}
      <div>
        <BreadCrumb pageName="PronounsType" />
        <div className="flex gap-4 mb-8 justify-end">
          <button>
            <h4
              className="text-xl rounded border bg-blue-500 text-gray px-5 py-1"
              onClick={toggleModal}
            >
              {'Add New PronounsType'}
            </h4>
          </button>
        </div>

        <div className="w-full h-full">
          <div className="ag-theme-quartz h-[500px] pb-4">
            <AgGridReact className="w-full" rowData={PronounsType.data} columnDefs={colDefs} />
          </div>
          <div className="relative z-1 -mt-4">
            {PronounsType?.count > 0 && (
              <Pagination getRequestData={fetchPronounsType} total={PronounsType.count} />
            )}
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default PronounsType;

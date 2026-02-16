import React, { useEffect, useState } from 'react';
import DefaultLayout from '@/layout/DefaultLayout';
import { toast } from 'react-toastify';
import SwitchInput from '@/components/ui/Switch';
import BreadCrumb from '@/components/common/ui/BreadCrumb';
import { AgGridReact } from 'ag-grid-react';
import Pagination from '@/components/common/ui/PaginationFooter';
import { IState, StateAPI, StateResponse } from '@/utils/api/state.api';
import StateAction from './component/StateAction';
import StateCU from './component/StateCU';

const State = () => {
  const [isAddState, setIsAddState] = useState<boolean>(false);
  const [State, setState] = useState<StateResponse>({
    count: 0,
    data: [],
  });

  const toggleModal = () => {
    setIsAddState(!isAddState);
  };

  const fetchState = async () => {
    try {
      const res = await StateAPI.getAll();
      console.log('res: ', res);
      if (res.status) {
        setState(res.result);
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  useEffect(() => {
    fetchState();
  }, []);

  const colDefs: any = [
    { field: 'name', headerName: 'Name', flex: 1, sortable: true },
    { field: 'countryName', headerName: 'Country', flex: 1, sortable: true },
    {
      field: 'isActive',
      headerName: 'Status',
      flex: 0.5,
      sortable: true,
      cellRenderer: (params: { data: IState }) => {
        const active = params?.data?.isActive as boolean;
        const handleSwitchChange = (newValue: boolean) => {
          StateAPI.updateStatus(params.data.id, newValue).then(() => {
            toast.success('Updated Successfully');
            fetchState();
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
      cellRenderer: (params: { data: IState }) => {
        return <StateAction data={params.data} fetchState={fetchState} />;
      },
    },
  ];
  return (
    <DefaultLayout>
      {isAddState && (
        <StateCU isOpen={isAddState} toggleModal={toggleModal} fetchLatestData={fetchState} />
      )}
      <div>
        <BreadCrumb pageName="State" />
        <div className="flex gap-4 mb-8 justify-end">
          <button>
            <h4
              className="text-xl rounded border bg-blue-500 text-gray px-5 py-1"
              onClick={toggleModal}
            >
              {'Add New State'}
            </h4>
          </button>
        </div>

        <div className="w-full h-full">
          <div className="ag-theme-quartz h-[500px] pb-4">
            <AgGridReact className="w-full" rowData={State.data} columnDefs={colDefs} />
          </div>
          <div className="relative z-1 -mt-4">
            {State?.count > 0 && <Pagination getRequestData={fetchState} total={State.count} />}
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default State;

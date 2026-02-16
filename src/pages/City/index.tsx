import React, { useEffect, useState } from 'react';
import DefaultLayout from '@/layout/DefaultLayout';
import { toast } from 'react-toastify';
import SwitchInput from '@/components/ui/Switch';
import BreadCrumb from '@/components/common/ui/BreadCrumb';
import { AgGridReact } from 'ag-grid-react';
import Pagination from '@/components/common/ui/PaginationFooter';
import CityAction from './component/CityAction';
import CityCU from './component/CityCU';
import { CityAPI, CityResponse, ICity } from '@/utils/api/city.api';

const City = () => {
  const [isAddCity, setIsAddCity] = useState<boolean>(false);
  const [City, setCity] = useState<CityResponse>({
    count: 0,
    data: [],
  });

  const toggleModal = () => {
    setIsAddCity(!isAddCity);
  };

  const fetchCity = async () => {
    try {
      const res = await CityAPI.getAll();
      console.log('res: ', res);
      if (res.status) {
        setCity(res.result);
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  useEffect(() => {
    fetchCity();
  }, []);

  const colDefs: any = [
    { field: 'name', headerName: 'Name', flex: 1, sortable: true },
    { field: 'stateName', headerName: 'state', flex: 1, sortable: true },
    { field: 'countryName', headerName: 'country', flex: 1, sortable: true },
    {
      field: 'isActive',
      headerName: 'Status',
      flex: 0.5,
      sortable: true,
      cellRenderer: (params: { data: ICity }) => {
        const active = params?.data?.isActive as boolean;
        const handleSwitchChange = (newValue: boolean) => {
          CityAPI.updateStatus(params.data.id, newValue).then(() => {
            toast.success('Updated Successfully');
            fetchCity();
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
      cellRenderer: (params: { data: ICity }) => {
        return <CityAction data={params.data} fetchCity={fetchCity} />;
      },
    },
  ];
  return (
    <DefaultLayout>
      {isAddCity && (
        <CityCU isOpen={isAddCity} toggleModal={toggleModal} fetchLatestData={fetchCity} />
      )}
      <div>
        <BreadCrumb pageName="City" />
        <div className="flex gap-4 mb-8 justify-end">
          <button>
            <h4
              className="text-xl rounded border bg-blue-500 text-gray px-5 py-1"
              onClick={toggleModal}
            >
              {'Add New City'}
            </h4>
          </button>
        </div>

        <div className="w-full h-full">
          <div className="ag-theme-quartz h-[500px] pb-4">
            <AgGridReact className="w-full" rowData={City.data} columnDefs={colDefs} />
          </div>
          <div className="relative z-1 -mt-4">
            {City?.count > 0 && <Pagination getRequestData={fetchCity} total={City.count} />}
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default City;

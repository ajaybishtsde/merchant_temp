import React, { useEffect, useState } from 'react';
import DefaultLayout from '@/layout/DefaultLayout';
import { toast } from 'react-toastify';
import SwitchInput from '@/components/ui/Switch';
import BreadCrumb from '@/components/common/ui/BreadCrumb';
import { AgGridReact } from 'ag-grid-react';
import Pagination from '@/components/common/ui/PaginationFooter';
import { PlaceCategoryResponse } from '@/utils/api/placeCategory.api';
import { PlaceCategoryAPI, IPlaceCategory } from '@/utils/api/placeCategory.api';
import PlaceCategoryCU from './component/PlaceCategoryCU';
import PlaceCategoryAction from './component/PlaceCategoryAction';

const PlaceCategory = () => {
  const [isAddPlaceCategory, setIsAddPlaceCategory] = useState<boolean>(false);
  const [PlaceCategory, setPlaceCategory] = useState<PlaceCategoryResponse>({
    count: 0,
    data: [],
  });

  const toggleModal = () => {
    setIsAddPlaceCategory(!isAddPlaceCategory);
  };

  const fetchPlaceCategory = async () => {
    try {
      const res = await PlaceCategoryAPI.getAll();
      console.log('res: ', res);
      if (res.status) {
        setPlaceCategory(res.result);
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  useEffect(() => {
    fetchPlaceCategory();
  }, []);

  const colDefs: any = [
    { field: 'name', headerName: 'Name', flex: 1, sortable: true },
    {
      field: 'isActive',
      headerName: 'Status',
      flex: 0.5,
      sortable: true,
      cellRenderer: (params: { data: IPlaceCategory }) => {
        const active = params?.data?.isActive as boolean;
        const handleSwitchChange = (newValue: boolean) => {
          PlaceCategoryAPI.updateStatus(params.data.id, newValue).then(() => {
            toast.success('Updated Successfully');
            fetchPlaceCategory();
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
      cellRenderer: (params: { data: IPlaceCategory }) => {
        return <PlaceCategoryAction data={params.data} fetchPlaceCategory={fetchPlaceCategory} />;
      },
    },
  ];
  return (
    <DefaultLayout>
      {isAddPlaceCategory && (
        <PlaceCategoryCU
          isOpen={isAddPlaceCategory}
          toggleModal={toggleModal}
          fetchLatestData={fetchPlaceCategory}
        />
      )}
      <div>
        <BreadCrumb pageName="Place Category" />
        <div className="flex gap-4 mb-8 justify-end">
          <button>
            <h4
              className="text-xl rounded border bg-blue-500 text-gray px-5 py-1"
              onClick={toggleModal}
            >
              {'Add New PlaceCategory'}
            </h4>
          </button>
        </div>

        <div className="w-full h-full">
          <div className="ag-theme-quartz h-[500px] pb-4">
            <AgGridReact className="w-full" rowData={PlaceCategory.data} columnDefs={colDefs} />
          </div>
          <div className="relative z-1 -mt-4">
            {PlaceCategory?.count > 0 && (
              <Pagination getRequestData={fetchPlaceCategory} total={PlaceCategory.count} />
            )}
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default PlaceCategory;

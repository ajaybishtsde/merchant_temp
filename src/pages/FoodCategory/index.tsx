import React, { useEffect, useState } from 'react';
import DefaultLayout from '@/layout/DefaultLayout';
import { toast } from 'react-toastify';
import SwitchInput from '@/components/ui/Switch';
import BreadCrumb from '@/components/common/ui/BreadCrumb';
import { AgGridReact } from 'ag-grid-react';
import Pagination from '@/components/common/ui/PaginationFooter';
import { FoodCategoryResponse } from '@/utils/api/foodCategory.api';
import { FoodCategoryAPI, IFoodCategory } from '@/utils/api/foodCategory.api';
import FoodCategoryCU from './component/FoodCategoryCU';
import FoodCategoryAction from './component/FoodCategoryAction';

const FoodCategory = () => {
  const [isAddFoodCategory, setIsAddFoodCategory] = useState<boolean>(false);
  const [FoodCategory, setFoodCategory] = useState<FoodCategoryResponse>({
    count: 0,
    data: [],
  });

  const toggleModal = () => {
    setIsAddFoodCategory(!isAddFoodCategory);
  };

  const fetchFoodCategory = async () => {
    try {
      const res = await FoodCategoryAPI.getAll();
      console.log('res: ', res);
      if (res.status) {
        setFoodCategory(res.result);
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  useEffect(() => {
    fetchFoodCategory();
  }, []);

  const colDefs: any = [
    { field: 'name', headerName: 'Name', flex: 1, sortable: true },
    {
      field: 'isActive',
      headerName: 'Status',
      flex: 0.5,
      sortable: true,
      cellRenderer: (params: { data: IFoodCategory }) => {
        const active = params?.data?.isActive as boolean;
        const handleSwitchChange = (newValue: boolean) => {
          FoodCategoryAPI.updateStatus(params.data.id, newValue).then(() => {
            toast.success('Updated Successfully');
            fetchFoodCategory();
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
      cellRenderer: (params: { data: IFoodCategory }) => {
        return <FoodCategoryAction data={params.data} fetchFoodCategory={fetchFoodCategory} />;
      },
    },
  ];
  return (
    <DefaultLayout>
      {isAddFoodCategory && (
        <FoodCategoryCU
          isOpen={isAddFoodCategory}
          toggleModal={toggleModal}
          fetchLatestData={fetchFoodCategory}
        />
      )}
      <div>
        <BreadCrumb pageName="FoodCategory" />
        <div className="flex gap-4 mb-8 justify-end">
          <button>
            <h4
              className="text-xl rounded border bg-blue-500 text-gray px-5 py-1"
              onClick={toggleModal}
            >
              {'Add New Food Category'}
            </h4>
          </button>
        </div>

        <div className="w-full h-full">
          <div className="ag-theme-quartz h-[500px] pb-4">
            <AgGridReact className="w-full" rowData={FoodCategory.data} columnDefs={colDefs} />
          </div>
          <div className="relative z-1 -mt-4">
            {FoodCategory?.count > 0 && (
              <Pagination getRequestData={fetchFoodCategory} total={FoodCategory.count} />
            )}
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default FoodCategory;

import React, { useEffect, useState } from 'react';
import DefaultLayout from '@/layout/DefaultLayout';
import { toast } from 'react-toastify';
import SwitchInput from '@/components/ui/Switch';
import BreadCrumb from '@/components/common/ui/BreadCrumb';
import { AgGridReact } from 'ag-grid-react';
import Pagination from '@/components/common/ui/PaginationFooter';
import PlaceOfferAction from './component/PlaceOfferAction';
import PlaceOfferCU from './component/PlaceOfferCU';
import { IPlaceOffer, PlaceOfferAPI, PlaceOfferResponse } from '@/utils/api/place-offer.api';

const PlaceOffer = () => {
  const [isAddPlaceOffer, setIsAddPlaceOffer] = useState<boolean>(false);
  const [PlaceOffer, setPlaceOffer] = useState<PlaceOfferResponse>({
    count: 0,
    data: [],
  });

  const toggleModal = () => {
    setIsAddPlaceOffer(!isAddPlaceOffer);
  };

  const fetchPlaceOffer = async () => {
    try {
      const res = await PlaceOfferAPI.getAll();
      console.log('res: ', res);
      if (res.status) {
        setPlaceOffer(res.result);
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  useEffect(() => {
    fetchPlaceOffer();
  }, []);

  const colDefs: any = [
    { field: 'place.googleLocationName', headerName: 'place', flex: 1, sortable: true },
    { field: 'redeem_code', headerName: 'Redeem Code', flex: 1, sortable: true },
    { field: 'description', headerName: 'description', flex: 1, sortable: true },
    { field: 'created_by_type', headerName: 'Created By', flex: 1, sortable: true },
    { field: 'updated_by_type', headerName: 'Updated By', flex: 1, sortable: true },
    { field: 'status', headerName: 'Status', flex: 1, sortable: true },
    {
      field: 'is_active',
      headerName: 'Is active',
      flex: 0.5,
      sortable: true,
      cellRenderer: (params: { data: IPlaceOffer }) => {
        const active = params?.data?.is_active as boolean;
        const handleSwitchChange = (newValue: boolean) => {
          console.log('is_active: ', params.data, newValue);
          PlaceOfferAPI.updateStatus(params.data.id, newValue).then(() => {
            toast.success('Updated Successfully');
            fetchPlaceOffer();
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
      cellRenderer: (params: { data: IPlaceOffer }) => {
        return <PlaceOfferAction data={params.data} fetchPlaceOffer={fetchPlaceOffer} />;
      },
    },
  ];

  return (
    <DefaultLayout>
      {isAddPlaceOffer && (
        <PlaceOfferCU
          isOpen={isAddPlaceOffer}
          toggleModal={toggleModal}
          fetchLatestData={fetchPlaceOffer}
        />
      )}
      <div>
        <BreadCrumb pageName="Place Offers" />
        <div className="flex gap-4 mb-8 justify-end">
          <button>
            <h4
              className="text-xl rounded border bg-blue-500 text-gray px-5 py-1"
              onClick={toggleModal}
            >
              {'Add New Place Offers'}
            </h4>
          </button>
        </div>

        <div className="w-full h-full">
          <div className="ag-theme-quartz h-[500px] pb-4">
            <AgGridReact className="w-full" rowData={PlaceOffer.data} columnDefs={colDefs} />
          </div>
          <div className="relative z-1 -mt-4">
            {PlaceOffer?.count > 0 && (
              <Pagination getRequestData={fetchPlaceOffer} total={PlaceOffer.count} />
            )}
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default PlaceOffer;

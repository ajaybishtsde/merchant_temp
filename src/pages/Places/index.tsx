import React, { useEffect, useState } from 'react';
import DefaultLayout from '@/layout/DefaultLayout';
import PlaceCU from './component/PlaceCU';
import BreadCrumb from '@/components/common/ui/BreadCrumb';
import { AgGridReact } from 'ag-grid-react';
import SwitchInput from '@/components/ui/Switch';
import { FilterHotspotQuery } from '@/components/common/Interfaces/filter.interface';
import { FilterBar } from '@/components/filters';
import Pagination from '@/components/common/ui/PaginationFooter';
import { toast } from 'react-toastify';
import { HotspotAPI, HotspotQuery, HotspotResponse, IPlaceHotspot } from '@/utils/api/hotspot.api';
import PlaceAction from './component/PlaceAction';
import PlaceFilter from '@/components/filters/PlaceFilter';
import { radDateFormatter } from '@/utils';

const Places = () => {
  const [isAddHotspot, setIsAddHotspot] = React.useState<boolean>(false);
  const [hotspot, setHotspot] = useState<HotspotResponse>({
    count: 0,
    data: [],
  });
  const [isOpenFilter, setIsOpenFilter] = useState<boolean>(false);
  const [filter, setFilter] = useState<FilterHotspotQuery>({});
  const [activeFilters, setActiveFilters] = useState<{
    [key: string]: string | boolean | any;
  }>({});

  const toggleFilterModal = () => {
    setIsOpenFilter(!isOpenFilter);
  };
  const handleFilterChange = <K extends keyof FilterHotspotQuery>(
    name: K,
    value: FilterHotspotQuery[K],
  ) => {
    setFilter({ ...filter, [name]: value });
  };

  const handleClearFilter = () => {
    setFilter({});
    setActiveFilters({});
    fetchPlace({});
  };

  const filterData = async () => {
    setActiveFilters(filter);
    await fetchPlace(filter);
  };

  const handleFilterCancel = async (filterKey: string) => {
    const updatedFilters = { ...activeFilters };
    delete updatedFilters[filterKey];
    setActiveFilters(updatedFilters);
    setFilter(updatedFilters);
    await fetchPlace(updatedFilters);
  };

  const toggleModal = () => {
    setIsAddHotspot(!isAddHotspot);
  };

  const fetchPlace = async (query?: HotspotQuery) => {
    try {
      const res = await HotspotAPI.getAll(query);
      if (res.status) {
        setHotspot(res.result);
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  useEffect(() => {
    fetchPlace();
  }, []);

  const colDefs: any = [
    {
      field: 'googleLocationName',
      headerName: 'Place Name',
      flex: 1,
      sortable: true,
    },

    {
      field: 'neighborhood.name',
      headerName: 'Neighborhood',
      flex: 1,
      sortable: true,
    },

    {
      field: 'isDeal',
      headerName: 'Deal',
      flex: 1,
      sortable: true,
      cellRenderer: (params: { data: IPlaceHotspot }) => {
        const isDeal = params?.data?.isDeal as boolean;

        return (
          <div className="flex items-center h-full">
            {isDeal ? <div>Available</div> : <div>Not Available</div>}
          </div>
        );
      },
    },

    {
      field: 'Created Time',
      headerName: 'Created',
      flex: 1,
      sortable: true,
      cellRenderer: (params: { data: IPlaceHotspot }) => {
        const date = params?.data?.createdAt as unknown as Date;
        return <div className="flex items-center h-full">{radDateFormatter(date)}</div>;
      },
    },
    { field: 'sharedCount', headerName: 'Shared', flex: 1, sortable: true },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
      sortable: true,
    },
    {
      field: 'isActive',
      headerName: 'Is active',
      flex: 0.5,
      sortable: true,
      cellRenderer: (params: { data: IPlaceHotspot }) => {
        const active = params?.data?.isActive as boolean;

        const handleSwitchChange = (newValue: boolean) => {
          HotspotAPI.updateStatus(
            params.data.id,
            { isActive: newValue },
            params.data.hotspotType,
          ).then(() => {
            toast.success('Updated Successfully');
            fetchPlace();
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
      flex: 0.7,
      sortable: true,
      cellRenderer: (params: { data: IPlaceHotspot }) => {
        return <PlaceAction data={params.data} fetchPlace={fetchPlace} />;
      },
    },
  ];

  return (
    <DefaultLayout>
      {isAddHotspot && (
        <PlaceCU isOpen={isAddHotspot} toggleModal={toggleModal} fetchLatestData={fetchPlace} />
      )}
      {isOpenFilter && (
        <PlaceFilter
          isOpen={isOpenFilter}
          toggleModal={toggleFilterModal}
          clearFilter={handleClearFilter}
          handleFilter={handleFilterChange}
          hotspot={filter}
          applyFilter={filterData}
        />
      )}
      <div>
        <div className="flex justify-between ">
          <BreadCrumb pageName="Places" />
          <div className="flex gap-4 mb-8 justify-end">
            <h1
              className="text-xl rounded border bg-blue-500 text-gray px-5 py-1 cursor-pointer"
              onClick={toggleFilterModal}
            >
              Filter
            </h1>
            {Object.entries(activeFilters).length > 0 && (
              <h1
                className="text-xl rounded border bg-blue-500 text-gray px-5 py-1 cursor-pointer"
                onClick={handleClearFilter}
              >
                Clear Filter
              </h1>
            )}

            <button>
              <h4
                className="text-xl rounded border bg-blue-500 text-gray px-5 py-1"
                onClick={toggleModal}
              >
                Add New Place
              </h4>
            </button>
          </div>
          {Object.entries(activeFilters).length > 0 && (
            <FilterBar activeFilters={activeFilters} onFilterCancel={handleFilterCancel} />
          )}
        </div>

        <div className="flex gap-4 mb-4">
          <button className={`px-4 py-2 rounded bg-blue-600 text-white`}>Places</button>
        </div>
        <div className="w-full h-full">
          <div className="ag-theme-quartz h-[500px] pb-4">
            <AgGridReact className="w-full" rowData={hotspot?.data} columnDefs={colDefs} />
          </div>
          <div className="relative z-1 -mt-4">
            {hotspot?.count > 0 && <Pagination getRequestData={fetchPlace} total={hotspot.count} />}
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default Places;

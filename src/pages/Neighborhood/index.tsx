import React, { useEffect, useState } from 'react';
import DefaultLayout from '@/layout/DefaultLayout';
import NeighborhoodCU from './component/NeighborhoodCU';
import BreadCrumb from '@/components/common/ui/BreadCrumb';
import { AgGridReact } from 'ag-grid-react';
import NeighborhoodAction from './component/NeighborhoodAction';
import SwitchInput from '@/components/ui/Switch';
import {
  INeighborhood,
  NeighborhoodAPI,
  NeighborhoodQuery,
  NeighborhoodResponse,
} from '@/utils/api/neighborhood.api';
import { FilterNeighborQuery } from '@/components/common/Interfaces/filter.interface';
import NeighborFilter from '@/components/filters/NeighborFilter';
import { FilterBar } from '@/components/filters';
import Pagination from '@/components/common/ui/PaginationFooter';
import { toast } from 'react-toastify';

const NeighborhoodList = () => {
  const [isAddState, setIsAddState] = React.useState<boolean>(false);
  const [state, setState] = useState<NeighborhoodResponse>({
    count: 0,
    data: [],
  });
  const [isOpenFilter, setIsOpenFilter] = useState<boolean>(false);
  const [filter, setFilter] = useState<FilterNeighborQuery>({});
  const [activeFilters, setActiveFilters] = useState<{ [key: string]: string | boolean | any }>({});

  const toggleFilterModal = () => {
    setIsOpenFilter(!isOpenFilter);
  };
  const handleFilterChange = <K extends keyof FilterNeighborQuery>(
    name: K,
    value: FilterNeighborQuery[K],
  ) => {
    setFilter({ ...filter, [name]: value });
  };

  const handleClearFilter = () => {
    setFilter({});
    setActiveFilters({});
    fetchEvents({});
  };

  const filterData = async () => {
    setActiveFilters(filter);
    await fetchEvents(filter);
  };

  const handleFilterCancel = async (filterKey: string) => {
    const updatedFilters = { ...activeFilters };
    delete updatedFilters[filterKey];
    setActiveFilters(updatedFilters);
    setFilter(updatedFilters);
    await fetchEvents(updatedFilters);
  };

  const toggleModal = () => {
    setIsAddState(!isAddState);
  };

  const fetchEvents = async (query?: NeighborhoodQuery) => {
    try {
      const res = await NeighborhoodAPI.getAll(query);
      if (res.status) {
        setState(res.result);
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const colDefs: any = [
    { field: 'name', headerName: 'Name', flex: 1, sortable: true },
    { field: 'city', headerName: 'City', flex: 1, sortable: true },
    { field: 'state', headerName: 'State', flex: 1, sortable: true },
    { field: 'country', headerName: 'Country', flex: 1, sortable: true },
    { field: 'dropInUserCount', headerName: 'Droppped in users', flex: 1, sortable: true },
    {
      field: 'isActive',
      headerName: 'Status',
      flex: 0.5,
      sortable: true,
      cellRenderer: (params: { data: INeighborhood }) => {
        const active = params?.data?.isActive as boolean;

        const handleSwitchChange = (newValue: boolean) => {
          NeighborhoodAPI.updateStatus(params.data.id, newValue).then(() => {
            toast.success('Updated Successfully');
            fetchEvents();
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
      cellRenderer: (params: { data: INeighborhood }) => {
        return <NeighborhoodAction data={params.data} fetchEvents={fetchEvents} />;
      },
    },
  ];

  return (
    <DefaultLayout>
      {isAddState && (
        <NeighborhoodCU
          isOpen={isAddState}
          toggleModal={toggleModal}
          fetchLatestData={fetchEvents}
        />
      )}
      {isOpenFilter && (
        <NeighborFilter
          isOpen={isOpenFilter}
          toggleModal={toggleFilterModal}
          clearFilter={handleClearFilter}
          handleFilter={handleFilterChange}
          state={filter}
          applyFilter={filterData}
        />
      )}
      <div>
        <BreadCrumb pageName="Neighborhood" />
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
              {'Add New Neighborhood'}
            </h4>
          </button>
        </div>
        {Object.entries(activeFilters).length > 0 && (
          <FilterBar activeFilters={activeFilters} onFilterCancel={handleFilterCancel} />
        )}
        <div className="w-full h-full">
          <div className="ag-theme-quartz h-[500px] pb-4">
            <AgGridReact className="w-full" rowData={state.data} columnDefs={colDefs} />
          </div>
          <div className="relative z-1 -mt-4">
            {state?.count > 0 && <Pagination getRequestData={fetchEvents} total={state.count} />}
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default NeighborhoodList;

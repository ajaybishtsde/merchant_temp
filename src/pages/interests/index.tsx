import React, { useEffect, useState } from 'react'
import DefaultLayout from '@/layout/DefaultLayout'
import CreateUpdateForm from './component/CreateUpdateForm'
import BreadCrumb from '@/components/common/ui/BreadCrumb'
import { AgGridReact } from 'ag-grid-react'
import ConnectionAction from './component/Action'
import SwitchInput from '@/components/ui/Switch'
import { IInterest, InterestAPI, InterestQuery, InterestResponse } from '@/utils/api/interests.api'
import { FilterInterestQuery } from '@/components/common/Interfaces/filter.interface'
import { FilterBar } from '@/components/filters'
import Pagination from '@/components/common/ui/PaginationFooter'
import { toast } from 'react-toastify'
import InterestFilter from '@/components/filters/InterestFilter'



const InterestList = () => {
  const [isAddState, setIsAddState] = React.useState<boolean>(false)
  const [state, setState] = useState<InterestResponse>({
    count: 5,
    data: [],
  })
  const [isOpenFilter, setIsOpenFilter] = useState<boolean>(false)
  const [filter, setFilter] = useState<FilterInterestQuery>({});
  const [activeFilters, setActiveFilters] = useState<{ [key: string]: string | boolean | any }>({});


  const toggleFilterModal = () => {
    setIsOpenFilter(!isOpenFilter)
  }
  const handleFilterChange = <K extends keyof FilterInterestQuery>(name: K, value: FilterInterestQuery[K]) => {
    setFilter({ ...filter, [name]: value });
  }

  const handleClearFilter = () => {
    setFilter({})
    setActiveFilters({})
    fetchInterests({})
  }

  const filterData = async () => {
    setActiveFilters(filter)
    await fetchInterests(filter);
  };

  const handleFilterCancel = async (filterKey: string) => {
    const updatedFilters = { ...activeFilters };
    delete updatedFilters[filterKey];
    setActiveFilters(updatedFilters);
    setFilter(updatedFilters)
    await fetchInterests(updatedFilters);
  };



  const toggleModal = () => {
    setIsAddState(!isAddState)
  }

  const fetchInterests = async (query?: InterestQuery) => {
    try {
      const res = await InterestAPI.getAll(query)
      if (res.status) {
        setState(res.result)
      }
    } catch (error) {
      console.log("error", error)
    }
  }

  useEffect(() => {
    fetchInterests()
  }, []);


  const colDefs: any = [
    { field: 'name', headerName: 'Name', flex: 1, sortable: true },
    {
      field: 'isTopInterest', headerName: 'Is Top Interest', flex: 1, sortable: true, cellRenderer: (params: { data: IInterest }) => {
        const active = params?.data?.isTopInterest as boolean;

        const handleSwitchChange = (newValue: boolean) => {
          InterestAPI.updateStatus(params.data.id, newValue).then(() => {
            toast.success('Updated Successfully')
            fetchInterests()
          });
        };

        return (
          <div className="flex items-center h-full">
            <SwitchInput
              initialValue={active}
              onChange={handleSwitchChange}
            />
          </div>
        );
      },
    },
    {
      field: 'isActive', headerName: 'Active', flex: 1, sortable: true, cellRenderer: (params: { data: IInterest }) => {
        const active = params?.data?.isActive as boolean;

        const handleSwitchChange = (newValue: boolean) => {
          InterestAPI.update(params.data.id, { isActive: newValue }).then(() => {
            toast.success('Updated Successfully')
            fetchInterests()
          });
        };

        return (
          <div className="flex items-center h-full">
            <SwitchInput
              initialValue={active}
              onChange={handleSwitchChange}
            />
          </div>
        );
      },
    },
    {
      field: 'isEnabled',
      headerName: 'Actions',
      flex: 0.5,
      sortable: true,
      cellRenderer: (params: { data: IInterest }) => {
        return <ConnectionAction data={params.data} fetchEvents={fetchInterests} />;
      },
    },
  ];

  return (
    <DefaultLayout>
      {isAddState &&
        <CreateUpdateForm
          isOpen={isAddState}
          toggleModal={toggleModal}
          fetchLatestData={fetchInterests}
        />
      }
      {isOpenFilter &&
        <InterestFilter
          isOpen={isOpenFilter}
          toggleModal={toggleFilterModal}
          clearFilter={handleClearFilter}
          handleFilter={handleFilterChange}
          state={filter}
          applyFilter={filterData}
        />}
      <div>
        <BreadCrumb pageName='Interest' />
        <div className="flex gap-4 mb-8 justify-end">
          {state.count > 0 && <h1 className='text-xl rounded border bg-blue-500 text-gray px-5 py-1 cursor-pointer' onClick={toggleFilterModal}>Filter</h1>}
          {Object.entries(activeFilters).length > 0 && <h1 className='text-xl rounded border bg-blue-500 text-gray px-5 py-1 cursor-pointer' onClick={handleClearFilter}>Clear Filter</h1>}

          <button >
            <h4 className="text-xl rounded border bg-blue-500 text-gray px-5 py-1" onClick={toggleModal}>
              {'Add New Interest'}
            </h4>
          </button>
        </div>
        {Object.entries(activeFilters).length > 0 && <FilterBar activeFilters={activeFilters} onFilterCancel={handleFilterCancel} />}
        <div className="w-full h-full">
          <div className="ag-theme-quartz h-[500px] pb-4">

            <AgGridReact className="w-full" rowData={state.data} columnDefs={colDefs} />

          </div>
          <div className='relative z-1 -mt-4'>
            {state?.count > 0 &&
              <Pagination getRequestData={fetchInterests} total={state.count} />
            }
          </div>
        </div>

      </div>
    </DefaultLayout>
  )
}

export default InterestList
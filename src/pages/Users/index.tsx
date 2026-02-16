import DefaultLayout from '@/layout/DefaultLayout';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { AgGridReact } from 'ag-grid-react';
import UserTableAction from './component/UserTableAction';
import { UserQueryDto } from '@/components/common/Interfaces/api.request-interface';
import Pagination from '@/components/common/ui/PaginationFooter';
import FilterUsers from '@/components/filters/FilterUsers';
import { FilterBar } from '@/components/filters';
import { radDateFormatter } from '@/utils';
import BreadCrumb from '@/components/common/ui/BreadCrumb';
import LoadingUI from '@/components/common/ui/Loading';
import { IUser, UserAPI, UserResponse } from '@/utils/api/user.api';

const UserList: React.FC = () => {
  const [state, setState] = React.useState<UserResponse>({
    count: 0,
    data: [],
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOpenFilter, setIsOpenFilter] = useState<boolean>(false);
  const [filter, setFilter] = useState<UserQueryDto>({});
  const [activeFilters, setActiveFilters] = useState<{ [key: string]: string | boolean | any }>({});

  const toggleFilterModal = () => {
    if (!state.count) {
      toast.warn('User Data is not available');
      return;
    }
    setIsOpenFilter(!isOpenFilter);
  };
  const handleFilterChange = <K extends keyof UserQueryDto>(name: K, value: UserQueryDto[K]) => {
    setFilter({ ...filter, [name]: value });
  };

  const handleClearFilter = () => {
    setFilter({});
    setActiveFilters({});
    fetchUsers();
  };

  const colDefs: any = [
    {
      field: 'user_name',
      headerName: 'Name',
      flex: 1,
      sortable: true,
      valueGetter: (params: { data: IUser }) =>
        `${params?.data?.user_firstName} ${params?.data?.user_lastName}`,
    },
    {
      field: 'phone',
      headerName: 'Phone',
      flex: 1,
      sortable: true,
      valueGetter: (params: { data: IUser }) => `${params?.data?.user_phoneNumber}`,
    },
    {
      field: 'u_dob',
      headerName: 'Date of Birth',
      flex: 1,
      sortable: true,
      cellRenderer: (params: { data: IUser }) => {
        const date = params?.data?.u_dob as unknown as Date;
        return <div className="flex items-center h-full">{radDateFormatter(date)}</div>;
      },
    },
    {
      field: 'isDroppedIn',
      headerName: 'Is Dropped In?',
      flex: 1,
      sortable: true,
      valueGetter: (params: { data: IUser }) => `${params?.data?.isDroppedIn}`,
    },
    {
      field: 'isActive',
      headerName: 'Active',
      flex: 1,
      sortable: true,
      valueGetter: (params: { data: IUser }) => `${params?.data?.isActive}`,
    },
    {
      field: 'Connections',
      headerName: 'Connections',
      flex: 1,
      sortable: true,
      valueGetter: (params: { data: IUser }) => `${params?.data?.user_totalConnections}`,
    },
    {
      field: 'Actions',
      flex: 0.6,
      filter: true,
      cellRenderer: (params: { data: any }) => {
        return <UserTableAction data={params.data} fetchUsers={fetchUsers} />;
      },
    },
  ];

  const fetchUsers = async (query?: any) => {
    try {
      setIsLoading(true);
      const res = await UserAPI.all({ ...query });
      if (res.status) {
        setState(res.result);
      }
    } catch (error: any) {
      toast.error(error.message || 'something went wrong', {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 1000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterUserData = async () => {
    setActiveFilters(filter);
    await fetchUsers(filter);
  };

  React.useEffect(() => {
    fetchUsers();
  }, []);

  const handleFilterCancel = async (filterKey: string) => {
    const updatedFilters = { ...activeFilters };
    delete updatedFilters[filterKey];
    setActiveFilters(updatedFilters);
    setFilter(updatedFilters);
    await fetchUsers(updatedFilters);
  };

  return (
    <DefaultLayout>
      {isOpenFilter && (
        <FilterUsers
          isOpen={isOpenFilter}
          toggleModal={toggleFilterModal}
          clearFilter={handleClearFilter}
          handleFilter={handleFilterChange}
          state={filter}
          applyFilter={filterUserData}
        />
      )}
      <BreadCrumb pageName={'Accounts Created'} />
      <div className="container">
        <div className="flex gap-4 mb-8 justify-end">
          <h1
            className="text-xl rounded border bg-blue-500 text-gray px-5 py-1 cursor-pointer"
            onClick={toggleFilterModal}
          >
            Filter
          </h1>
          <h1
            className="text-xl rounded border bg-blue-500 text-gray px-5 py-1 cursor-pointer"
            onClick={handleClearFilter}
          >
            Clear Filter
          </h1>
        </div>
        {Object.entries(activeFilters).length > 0 && (
          <FilterBar activeFilters={activeFilters} onFilterCancel={handleFilterCancel} />
        )}
        <div className="w-full h-full">
          <div className="ag-theme-quartz h-[500px] pb-4">
            {!isLoading ? (
              <AgGridReact className="w-full" rowData={state.data} columnDefs={colDefs} />
            ) : (
              <LoadingUI />
            )}
          </div>
          <div className="relative z-1 -mt-4">
            {state.count > 0 && <Pagination getRequestData={fetchUsers} total={state.count} />}
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default UserList;

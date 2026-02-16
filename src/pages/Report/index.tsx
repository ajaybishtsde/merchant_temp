import React, { useEffect, useState } from 'react';
import DefaultLayout from '@/layout/DefaultLayout';
import BreadCrumb from '@/components/common/ui/BreadCrumb';
import { AgGridReact } from 'ag-grid-react';
import { FilterBar } from '@/components/filters';
import Pagination from '@/components/common/ui/PaginationFooter';
import { ReportAPI, ReportResponse } from '@/utils/api/report.api';
import { FilterReportQuery } from '@/components/common/Interfaces/filter.interface';
import ReportFilter from '@/components/filters/ReportFilter';

const ReportList = () => {
  const [report, setReport] = useState<ReportResponse>({
    count: 0,
    data: [],
  });
  const [isOpenFilter, setIsOpenFilter] = useState<boolean>(false);
  const [filter, setFilter] = useState<FilterReportQuery>({});
  const [activeFilters, setActiveFilters] = useState<{ [key: string]: string | boolean | any }>({});

  const toggleFilterModal = () => {
    setIsOpenFilter(!isOpenFilter);
  };
  const handleFilterChange = <K extends keyof FilterReportQuery>(
    name: K,
    value: FilterReportQuery[K],
  ) => {
    setFilter({ ...filter, [name]: value });
  };

  const handleClearFilter = () => {
    setFilter({});
    setActiveFilters({});
    fetchReports({});
  };

  const filterData = async () => {
    setActiveFilters(filter);
    await fetchReports(filter);
  };

  const handleFilterCancel = async (filterKey: string) => {
    const updatedFilters = { ...activeFilters };
    delete updatedFilters[filterKey];
    setActiveFilters(updatedFilters);
    setFilter(updatedFilters);
    await fetchReports(updatedFilters);
  };

  const fetchReports = async (query?: any) => {
    try {
      const res = await ReportAPI.getAll(query);
      if (res.status) {
        setReport(res.result);
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const colDefs: any = [
    { field: 'message', headerName: 'Message', flex: 1, sortable: true },
    { field: 'status', headerName: 'Status', flex: 1, sortable: true },
    { field: 'reportedUser', headerName: 'Reported User', flex: 1, sortable: true },
    { field: 'reporter', headerName: 'Reporter', flex: 1, sortable: true },
    {
      field: 'createdAt',
      headerName: 'Reported Date',
      flex: 1,
      sortable: true,
      valueFormatter: (params: any) => {
        if (!params.value) return 'N/A';
        return new Intl.DateTimeFormat('en-US', {
          year: 'numeric',
          month: 'short',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
        }).format(new Date(params.value));
      },
    },
  ];

  return (
    <DefaultLayout>
      {isOpenFilter && (
        <ReportFilter
          isOpen={isOpenFilter}
          toggleModal={toggleFilterModal}
          clearFilter={handleClearFilter}
          handleFilter={handleFilterChange}
          report={filter}
          applyFilter={filterData}
        />
      )}
      <div>
        <BreadCrumb pageName="Reported Users" />
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
        </div>
        {Object.entries(activeFilters).length > 0 && (
          <FilterBar activeFilters={activeFilters} onFilterCancel={handleFilterCancel} />
        )}
        <div className="w-full h-full">
          <div className="ag-theme-quartz h-[500px] pb-4">
            <AgGridReact className="w-full" rowData={report.data} columnDefs={colDefs} />
          </div>
          <div className="relative z-1 -mt-4">
            {report?.count > 0 && <Pagination getRequestData={fetchReports} total={report.count} />}
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default ReportList;

import React from 'react';
import { FilterDashboardQuery } from '../common/Interfaces/filter.interface';
import BaseModal from '../common/model';

interface DashboardFilterProps {
  isOpen: boolean;
  toggleModal: () => void;
  state: FilterDashboardQuery;
  handleFilter: <K extends keyof FilterDashboardQuery>(name: K, value: any) => void;
  clearFilter: () => void;
  applyFilter: () => void;
}

const DashboardFilter: React.FC<DashboardFilterProps> = ({
  isOpen,
  state,
  toggleModal,
  handleFilter,
  clearFilter,
  applyFilter,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    handleFilter(name as keyof FilterDashboardQuery, value);
  };

  // const handleClearFilter = () => {
  //     clearFilter()
  //     toggleModal()
  // }

  const handleApplyFilter = () => {
    applyFilter();
    toggleModal();
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <BaseModal isOpen={isOpen} toggleModal={toggleModal} heading="Filter Dashboardhoods">
      <div className="my-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleApplyFilter();
          }}
        >
          <label className="block font-medium">Select start date</label>
          <input
            type="date"
            name="startDate"
            value={state.startDate || ''}
            onChange={handleChange}
            max={today}
            required
            placeholder="Enter name"
            className="py-3 max-w-md w-full bg-gray my-4 text-slate-900 border px-4 rounded dark:bg-slate-800 dark:text-gray"
          />

          <label className="block font-medium">Select end date</label>
          <input
            type="date"
            name="endDate"
            value={state.endDate || ''}
            onChange={handleChange}
            max={today}
            min={state.startDate || ''}
            required
            placeholder="Enter endDate"
            className="py-3 max-w-md w-full bg-gray my-4 text-slate-900 border px-4 rounded dark:bg-slate-800 dark:text-gray"
          />

          <div className="flex w-full gap-5 px-2 mt-10 absolute bottom-8 left-0">
            {/* <button onClick={handleClearFilter} className='border px-5 py-2 rounded-lg w-full'>Clear</button> */}
            <button
              type="submit"
              className="border px-5 py-2 rounded-lg w-full bg-slate-800 text-white"
            >
              Apply
            </button>
          </div>
        </form>
      </div>
    </BaseModal>
  );
};

export default DashboardFilter;

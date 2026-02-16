import React from 'react';
import { FilterInterestQuery } from '../common/Interfaces/filter.interface';
import BaseModal from '../common/model';
import { IsActiveFilter } from '../common/Interfaces';

interface InterestFilterProps {
  isOpen: boolean;
  toggleModal: () => void;
  state: FilterInterestQuery;
  handleFilter: <K extends keyof FilterInterestQuery>(name: K, value: any) => void;
  clearFilter: () => void;
  applyFilter: () => void;
}

const InterestFilter: React.FC<InterestFilterProps> = ({
  isOpen,
  state,
  toggleModal,
  handleFilter,
  clearFilter,
  applyFilter,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let isActiveValue: boolean | undefined = undefined;

    if (name === 'isActive' && value === IsActiveFilter.Active) {
      isActiveValue = true;
    } else if (name === 'isActive' && value === IsActiveFilter.InActive) {
      isActiveValue = false;
    }

    const filterValue = name === 'isActive' ? isActiveValue : value;
    handleFilter(name as keyof FilterInterestQuery, filterValue);
  };

  const handleClearFilter = () => {
    clearFilter();
    toggleModal();
  };

  const handleApplyFilter = () => {
    applyFilter();
    toggleModal();
  };

  return (
    <BaseModal isOpen={isOpen} toggleModal={toggleModal} heading="Filter Interest">
      <div className="my-4">
        <input
          type="text"
          name="search"
          value={state.search || ''}
          onChange={handleChange}
          placeholder="Enter name"
          className="py-3 max-w-md w-full bg-gray my-4 text-slate-900 border px-4 rounded dark:bg-slate-800 dark:text-gray"
        />

        <div className="flex w-full gap-5 px-2 mt-10 absolute bottom-8 left-0">
          <button onClick={handleClearFilter} className="border px-5 py-2 rounded-lg w-full">
            Clear
          </button>
          <button
            onClick={handleApplyFilter}
            className="border px-5 py-2 rounded-lg w-full bg-slate-800 text-white"
          >
            apply
          </button>
        </div>
      </div>
    </BaseModal>
  );
};

export default InterestFilter;

import React, { useEffect, useState } from 'react';
import { FilterNeighborQuery } from '../common/Interfaces/filter.interface';
import BaseModal from '../common/model';
import { IsActiveFilter } from '../common/Interfaces';
import { StateAPI, StateResponse } from '@/utils/api/state.api';
import { CityAPI, CityResponse } from '@/utils/api/city.api';

interface NeighborFilterProps {
  isOpen: boolean;
  toggleModal: () => void;
  state: FilterNeighborQuery;
  handleFilter: <K extends keyof FilterNeighborQuery>(name: K, value: any) => void;
  clearFilter: () => void;
  applyFilter: () => void;
}

const NeighborFilter: React.FC<NeighborFilterProps> = ({
  isOpen,
  state,
  toggleModal,
  handleFilter,
  clearFilter,
  applyFilter,
}) => {
  const [states, setStates] = useState<StateResponse>({ count: 0, data: [] });
  const [cities, setCity] = useState<CityResponse>({ count: 0, data: [] });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let isActiveValue: boolean | undefined = undefined;

    if (name === 'isActive' && value === IsActiveFilter.Active) {
      isActiveValue = true;
    } else if (name === 'isActive' && value === IsActiveFilter.InActive) {
      isActiveValue = false;
    }

    const filterValue = name === 'isActive' ? isActiveValue : value;
    handleFilter(name as keyof FilterNeighborQuery, filterValue);

    if (name === 'stateId') {
      console.log('name: ', value);
      fetchCities(Number(value));
    }
  };

  const fetchStates = async () => {
    try {
      const res = await StateAPI.getAll({ isActive: true });
      if (res.status) {
        setStates(res.result);
      }
    } catch (error) {
      console.log('error: ', error);
    }
  };

  const fetchCities = async (stateId?: number) => {
    try {
      const res = await CityAPI.getAll({ isActive: true, stateId });
      if (res.status) {
        setCity(res.result);
      }
    } catch (error) {
      console.log('error: ', error);
    }
  };

  useEffect(() => {
    (fetchStates(), fetchCities());
  }, []);

  const handleClearFilter = () => {
    clearFilter();
    toggleModal();
  };

  const handleApplyFilter = () => {
    applyFilter();
    toggleModal();
  };

  return (
    <BaseModal isOpen={isOpen} toggleModal={toggleModal} heading="Filter Neighborhoods">
      <div className="my-4">
        <input
          type="text"
          name="name"
          value={state.name || ''}
          onChange={handleChange}
          placeholder="Enter name"
          className="py-3 max-w-md w-full bg-gray my-4 text-slate-900 border px-4 rounded dark:bg-slate-800 dark:text-gray"
        />

        <select
          name="stateId"
          value={state.stateId || ''}
          onChange={handleChange}
          className="py-3 max-w-md w-full bg-gray my-4 text-slate-900 border px-4 rounded dark:bg-slate-800 dark:text-gray"
        >
          <option value="">Select State</option>
          {states.data.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>

        <select
          name="cityId"
          value={state.cityId || ''}
          onChange={handleChange}
          className="py-3 max-w-md w-full bg-gray my-4 text-slate-900 border px-4 rounded dark:bg-slate-800 dark:text-gray"
        >
          <option value="">Select City</option>
          {cities.data.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <select
          name="isActive"
          value={
            state.isActive !== undefined
              ? state.isActive
                ? IsActiveFilter.Active
                : IsActiveFilter.InActive
              : ''
          }
          className="py-3 max-w-md w-full bg-gray my-4 text-slate-900 border px-4 rounded dark:bg-slate-800 dark:text-gray"
          onChange={handleChange}
        >
          <option value="">{state.isActive ? 'All' : 'Select status'}</option>
          {Object.values(IsActiveFilter).map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
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

export default NeighborFilter;

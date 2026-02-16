import React from 'react';
import BaseModal from '../common/model';
import { IsActiveFilter } from '../common/Interfaces';
import { UserQueryDto } from '../common/Interfaces/api.request-interface';

interface FilterUsers {
    isOpen: boolean;
    toggleModal: () => void;
    state: UserQueryDto;
    handleFilter: <K extends keyof UserQueryDto>(name: K, value: any) => void;
    clearFilter: () => void;
    applyFilter: () => void;
}

const FilterUsers: React.FC<FilterUsers> = (props) => {
    const { isOpen, toggleModal, state, handleFilter, clearFilter, applyFilter } = props;
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        let isActiveValue: boolean | undefined = undefined;

        if ((name === 'isActive' || name === 'isAccountDeactivated') &&
            value === IsActiveFilter.Active) {
            isActiveValue = true;
        } else if (
            (name === 'isActive' || name === 'isAccountDeactivated') &&
            value === IsActiveFilter.InActive) {
            isActiveValue = false;
        }

        const filterValue = name === ('isActive') ? isActiveValue : value;
        handleFilter(name as keyof UserQueryDto, filterValue);
    };

    const handleClearFilter = () => {
        clearFilter()
        toggleModal()
    }

    const handleApplyFilter = () => {
        applyFilter()
        toggleModal()
    }


    return (
        <BaseModal isOpen={isOpen} toggleModal={toggleModal} heading='Filter Users'>
            <div className="my-4">

                <input
                    type="text"
                    name="name"
                    value={state.name || ''}
                    onChange={handleChange}
                    placeholder="enter name"
                    className='py-3 w-full bg-gray my-4 text-slate-900 border px-4 rounded dark:bg-slate-800 dark:text-gray'
                />
                <input
                    type="text"
                    name="phoneNumber"
                    value={state.phoneNumber || ''}
                    onChange={handleChange}
                    placeholder="enter phoneNumber"
                    className='py-3 w-full bg-gray my-4 text-slate-900 border px-4 rounded dark:bg-slate-800 dark:text-gray'
                />
                <div className="flex w-full gap-5 px-2 mt-10 absolute bottom-8 left-0">
                    <button onClick={handleClearFilter} className='border px-5 py-2 rounded-lg w-full'>Clear</button>
                    <button onClick={handleApplyFilter} className='border px-5 py-2 rounded-lg w-full bg-slate-800 text-white'>apply</button>
                </div>
            </div>
        </BaseModal>
    );
};

export default FilterUsers;

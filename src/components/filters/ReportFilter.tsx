import React from 'react';
import { FilterReportQuery } from '../common/Interfaces/filter.interface';
import BaseModal from '../common/model';

interface ReportFilterProps {
    isOpen: boolean;
    toggleModal: () => void;
    report: FilterReportQuery;
    handleFilter: <K extends keyof FilterReportQuery>(name: K, value: any) => void;
    clearFilter: () => void;
    applyFilter: () => void;
}

const ReportFilter: React.FC<ReportFilterProps> = ({ isOpen, report, toggleModal, handleFilter, clearFilter, applyFilter }) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        handleFilter(name as keyof FilterReportQuery, value);
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
        <BaseModal isOpen={isOpen} toggleModal={toggleModal} heading='Filter Reporthoods'>
            <div className="my-4">
                <input
                    type="text"
                    name="reportedUser"
                    value={report.reportedUser || ''}
                    onChange={handleChange}
                    placeholder="Enter Reported user name"
                    className='py-3 max-w-md w-full bg-gray my-4 text-slate-900 border px-4 rounded dark:bg-slate-800 dark:text-gray'
                />
                <input
                    type="text"
                    name="reporter"
                    value={report.reporter || ''}
                    onChange={handleChange}
                    placeholder="Enter Reporter user name"
                    className='py-3 max-w-md w-full bg-gray my-4 text-slate-900 border px-4 rounded dark:bg-slate-800 dark:text-gray'
                />
                <div className="flex w-full gap-5 px-2 mt-10 absolute bottom-8 left-0">
                    <button onClick={handleClearFilter} className='border px-5 py-2 rounded-lg w-full'>Clear</button>
                    <button onClick={handleApplyFilter} className='border px-5 py-2 rounded-lg w-full bg-slate-800 text-white'>apply</button>
                </div>
            </div>
        </BaseModal>
    );
};

export default ReportFilter;

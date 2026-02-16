import React from 'react'

interface BaseTableProps {
    columns: string[];
    children: React.ReactNode
}

const BaseTable: React.FC<BaseTableProps> = ({ children, columns }) => {
    return (
        <table
            className="w-full table-auto text-sm text-left border rounded-sm border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1"
        >
            <thead className="font-bold border-b text-base bg-gray-2 dark:bg-meta-4">
                <tr>
                    {columns.map((col) => (
                        <th scope="col" className="p-2.5 xl:p-5" key={col}>
                            <span className='text-sm font-medium uppercase xsm:text-base text-center'>
                                {col}
                            </span>
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody className="">
                {children}
            </tbody>
        </table>
    )
}

export default BaseTable
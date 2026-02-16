import React, { useEffect, useState } from 'react';
import DefaultLayout from '@/layout/DefaultLayout';
import { toast } from 'react-toastify';
import SwitchInput from '@/components/ui/Switch';
import BreadCrumb from '@/components/common/ui/BreadCrumb';
import { AgGridReact } from 'ag-grid-react';
import Pagination from '@/components/common/ui/PaginationFooter';
import { PriceRangeResponse } from '@/utils/api/priceRange.api';
import { PriceRangeAPI, IPriceRange } from '@/utils/api/priceRange.api';
import PriceRangeCU from './component/PriceRangeCU';
import PriceRangeAction from './component/PriceRangeAction';


const PriceRange = () => {
    const [isAddPriceRange, setIsAddPriceRange] = useState<boolean>(false)
    const [PriceRange, setPriceRange] = useState<PriceRangeResponse>({
        count: 0,
        data: []
    })

    const toggleModal = () => {
        setIsAddPriceRange(!isAddPriceRange)
    }

    const fetchPriceRange = async () => {
        try {
            const res = await PriceRangeAPI.getAll();
            console.log("res: ", res)
            if (res.status) {
                setPriceRange(res.result)
            }
        } catch (error) {
            console.log("error", error)
        }
    }

    useEffect(() => {
        fetchPriceRange()
    }, [])

    const colDefs: any = [
        { field: 'range', headerName: 'Range', flex: 1, sortable: true },
        {
            field: 'isActive',
            headerName: 'Status',
            flex: 0.5,
            sortable: true,
            cellRenderer: (params: { data: IPriceRange }) => {
                const active = params?.data?.isActive as boolean;
                const handleSwitchChange = (newValue: boolean) => {
                    PriceRangeAPI.updateStatus(params.data.id, newValue).then(() => {
                        toast.success('Updated Successfully')
                        fetchPriceRange()
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
            cellRenderer: (params: { data: IPriceRange }) => {
                return <PriceRangeAction data={params.data} fetchPriceRange={fetchPriceRange} />;
            },
        },
    ];
    return (
        <DefaultLayout>
            {isAddPriceRange &&
                <PriceRangeCU
                    isOpen={isAddPriceRange}
                    toggleModal={toggleModal}
                    fetchLatestData={fetchPriceRange}
                />
            }
            <div>
                <BreadCrumb pageName='Price Range' />
                <div className="flex gap-4 mb-8 justify-end">
                    <button >
                        <h4 className="text-xl rounded border bg-blue-500 text-gray px-5 py-1" onClick={toggleModal}>
                            {'Add New PriceRange'}
                        </h4>
                    </button>
                </div>

                <div className="w-full h-full">
                    <div className="ag-theme-quartz h-[500px] pb-4">

                        <AgGridReact className="w-full" rowData={PriceRange.data} columnDefs={colDefs} />

                    </div>
                    <div className='relative z-1 -mt-4'>
                        {PriceRange?.count > 0 &&
                            <Pagination getRequestData={fetchPriceRange} total={PriceRange.count} />
                        }
                    </div>
                </div>

            </div>
        </DefaultLayout>
    )
};

export default PriceRange;

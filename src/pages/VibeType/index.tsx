import React, { useEffect, useState } from 'react';
import DefaultLayout from '@/layout/DefaultLayout';
import { toast } from 'react-toastify';
import SwitchInput from '@/components/ui/Switch';
import BreadCrumb from '@/components/common/ui/BreadCrumb';
import { AgGridReact } from 'ag-grid-react';
import Pagination from '@/components/common/ui/PaginationFooter';
import { VibeTypeResponse } from '@/utils/api/vibeType.api';
import { VibeTypeAPI, IVibeType } from '@/utils/api/vibeType.api';
import VibeTypeAction from './component/VibeTypeAction';
import VibeTypeCU from './component/VibeTypeCU';


const VibeType = () => {
    const [isAddVibeType, setIsAddVibeType] = useState<boolean>(false)
    const [VibeType, setVibeType] = useState<VibeTypeResponse>({
        count: 0,
        data: []
    })

    const toggleModal = () => {
        setIsAddVibeType(!isAddVibeType)
    }

    const fetchVibeType = async () => {
        try {
            const res = await VibeTypeAPI.getAll();
            console.log("res: ", res)
            if (res.status) {
                setVibeType(res.result)
            }
        } catch (error) {
            console.log("error", error)
        }
    }

    useEffect(() => {
        fetchVibeType()
    }, [])

    const colDefs: any = [
        { field: 'name', headerName: 'Name', flex: 1, sortable: true },
        {
            field: 'isActive',
            headerName: 'Status',
            flex: 0.5,
            sortable: true,
            cellRenderer: (params: { data: IVibeType }) => {
                const active = params?.data?.isActive as boolean;
                const handleSwitchChange = (newValue: boolean) => {
                    VibeTypeAPI.updateStatus(params.data.id, newValue).then(() => {
                        toast.success('Updated Successfully')
                        fetchVibeType()
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
            cellRenderer: (params: { data: IVibeType }) => {
                return <VibeTypeAction data={params.data} fetchVibeType={fetchVibeType} />;
            },
        },
    ];
    return (
        <DefaultLayout>
            {isAddVibeType &&
                <VibeTypeCU
                    isOpen={isAddVibeType}
                    toggleModal={toggleModal}
                    fetchLatestData={fetchVibeType}
                />
            }
            <div>
                <BreadCrumb pageName='Vibe Type' />
                <div className="flex gap-4 mb-8 justify-end">
                    <button >
                        <h4 className="text-xl rounded border bg-blue-500 text-gray px-5 py-1" onClick={toggleModal}>
                            {'Add New VibeType'}
                        </h4>
                    </button>
                </div>

                <div className="w-full h-full">
                    <div className="ag-theme-quartz h-[500px] pb-4">

                        <AgGridReact className="w-full" rowData={VibeType.data} columnDefs={colDefs} />

                    </div>
                    <div className='relative z-1 -mt-4'>
                        {VibeType?.count > 0 &&
                            <Pagination getRequestData={fetchVibeType} total={VibeType.count} />
                        }
                    </div>
                </div>

            </div>
        </DefaultLayout>
    )
};

export default VibeType;

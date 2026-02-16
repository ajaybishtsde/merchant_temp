import React, { useEffect, useState } from 'react';
import DefaultLayout from '@/layout/DefaultLayout';
import BreadCrumb from '@/components/common/ui/BreadCrumb';
import { AgGridReact } from 'ag-grid-react';
import Pagination from '@/components/common/ui/PaginationFooter';
import { IOpenTo, OpenToAPI, OpenToResponse } from '@/utils/api/opento.api';
// import { toast } from 'react-toastify';
// import SwitchInput from '@/components/ui/Switch';
import OpenToAction from './component/OpenToAction';
import OpenToCU from './component/OpenToCU';

const OpenTo = () => {
    const [isAddOpenTo, setIsAddOpenTo] = useState<boolean>(false)
    const [openTo, setOpenTo] = useState<OpenToResponse>({
        count: 0,
        data: []
    })

    const toggleModal = () => {
        setIsAddOpenTo(!isAddOpenTo)
    }

    const fetchOpenTo = async () => {
        try {
            const res = await OpenToAPI.getAll();
            console.log("res: ", res)
            if (res.status) {
                setOpenTo(res.result)
            }
        } catch (error) {
            console.log("error", error)
        }
    }

    useEffect(() => {
        fetchOpenTo()
    }, [])

    const colDefs: any = [
        { field: 'name', headerName: 'Name', flex: 1, sortable: true },
        { field: 'name_ja', headerName: 'Name(Japanese)', flex: 1, sortable: true },
        { field: 'name_zh', headerName: 'Name(Chinese)', flex: 1, sortable: true },
        { field: 'name_es', headerName: 'Name(Spanish)', flex: 1, sortable: true },
        // {
        //     field: 'isActive',
        //     headerName: 'Status',
        //     flex: 0.5,
        //     sortable: true,
        //     cellRenderer: (params: { data: IOpenTo }) => {
        //         const active = params?.data?.isActive as boolean;
        //         const handleSwitchChange = (newValue: boolean) => {
        //             OpenToAPI.updateStatus(params.data.id, newValue).then(() => {
        //                 toast.success('Updated Successfully')
        //                 fetchOpenTo()
        //             });

        //         };
        //         return (
        //             <div className="flex items-center h-full">
        //                 <SwitchInput
        //                     initialValue={active}
        //                     onChange={handleSwitchChange}
        //                 />
        //             </div>
        //         );
        //     },
        // },
        {
            field: 'isEnabled',
            headerName: 'Actions',
            flex: 0.5,
            sortable: true,
            cellRenderer: (params: { data: IOpenTo }) => {
                return <OpenToAction data={params.data} fetchOpenTo={fetchOpenTo} />;
            },
        },
    ];

    return (
        <DefaultLayout>
            {isAddOpenTo &&
                <OpenToCU
                    isOpen={isAddOpenTo}
                    toggleModal={toggleModal}
                    fetchLatestData={fetchOpenTo}
                />
            }
            <div>
                <BreadCrumb pageName='OpenTo' />
                {/* <div className="flex gap-4 mb-8 justify-end">
                    <button >
                        <h4 className="text-xl rounded border bg-blue-500 text-gray px-5 py-1" onClick={toggleModal}>
                            {'Add New OpenTo'}
                        </h4>
                    </button>
                </div> */}

                <div className="w-full h-full">
                    <div className="ag-theme-quartz h-[500px] pb-4">

                        <AgGridReact className="w-full" rowData={openTo.data} columnDefs={colDefs} />

                    </div>
                    <div className='relative z-1 -mt-4'>
                        {openTo?.count > 0 &&
                            <Pagination getRequestData={fetchOpenTo} total={openTo.count} />
                        }
                    </div>
                </div>

            </div>
        </DefaultLayout>
    )
};

export default OpenTo;

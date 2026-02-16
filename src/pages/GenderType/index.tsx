import React, { useEffect, useState } from 'react';
import DefaultLayout from '@/layout/DefaultLayout';
import { toast } from 'react-toastify';
import SwitchInput from '@/components/ui/Switch';
import BreadCrumb from '@/components/common/ui/BreadCrumb';
import { AgGridReact } from 'ag-grid-react';
import Pagination from '@/components/common/ui/PaginationFooter';
import { GenderTypeAPI, GenderTypeResponse, IGenderType } from '@/utils/api/gendertype.api';
import GenderTypeAction from './component/GenderTypeAction';
import GenderTypeCU from './component/GenderTypeCU';

const GenderType = () => {
    const [isAddGenderType, setIsAddGenderType] = useState<boolean>(false)
    const [GenderType, setGenderType] = useState<GenderTypeResponse>({
        count: 0,
        data: []
    })

    const toggleModal = () => {
        setIsAddGenderType(!isAddGenderType)
    }

    const fetchGenderType = async () => {
        try {
            const res = await GenderTypeAPI.getAll();
            console.log("res: ", res)
            if (res.status) {
                setGenderType(res.result)
            }
        } catch (error) {
            console.log("error", error)
        }
    }

    useEffect(() => {
        fetchGenderType()
    }, [])

    const colDefs: any = [
        { field: 'name', headerName: 'Name', flex: 1, sortable: true },
        { field: 'name_ja', headerName: 'Name(Japanese)', flex: 1, sortable: true },
        { field: 'name_zh', headerName: 'Name(Chinese)', flex: 1, sortable: true },
        { field: 'name_es', headerName: 'Name(Spanish)', flex: 1, sortable: true },
        {
            field: 'isActive',
            headerName: 'Status',
            flex: 0.5,
            sortable: true,
            cellRenderer: (params: { data: IGenderType }) => {
                const active = params?.data?.isActive as boolean;
                const handleSwitchChange = (newValue: boolean) => {
                    GenderTypeAPI.updateStatus(params.data.id, newValue).then(() => {
                        toast.success('Updated Successfully')
                        fetchGenderType()
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
            cellRenderer: (params: { data: IGenderType }) => {
                return <GenderTypeAction data={params.data} fetchGenderType={fetchGenderType} />;
            },
        },
    ];
    return (
        <DefaultLayout>
            {isAddGenderType &&
                <GenderTypeCU
                    isOpen={isAddGenderType}
                    toggleModal={toggleModal}
                    fetchLatestData={fetchGenderType}
                />
            }
            <div>
                <BreadCrumb pageName='GenderType' />
                <div className="flex gap-4 mb-8 justify-end">
                    <button >
                        <h4 className="text-xl rounded border bg-blue-500 text-gray px-5 py-1" onClick={toggleModal}>
                            {'Add New GenderType'}
                        </h4>
                    </button>
                </div>

                <div className="w-full h-full">
                    <div className="ag-theme-quartz h-[500px] pb-4">

                        <AgGridReact className="w-full" rowData={GenderType.data} columnDefs={colDefs} />

                    </div>
                    <div className='relative z-1 -mt-4'>
                        {GenderType?.count > 0 &&
                            <Pagination getRequestData={fetchGenderType} total={GenderType.count} />
                        }
                    </div>
                </div>

            </div>
        </DefaultLayout>
    )
};

export default GenderType;

import React, { useEffect, useState } from 'react';
import DefaultLayout from '@/layout/DefaultLayout';
import BreadCrumb from '@/components/common/ui/BreadCrumb';
import { AgGridReact } from 'ag-grid-react';
import Pagination from '@/components/common/ui/PaginationFooter';
import { AppPasswordAPI, AppPasswordResponse, IAppPassword } from '@/utils/api/app-password.api';
import { toast } from 'react-toastify';
import SwitchInput from '@/components/ui/Switch';
import AppPasswordCU from './component/AppPasswordCU';
import AppPasswordAction from './component/AppPasswordAction';
import { radDateFormatter } from '@/utils';

const AppPassword = () => {
    const [isAddPassword, setIsAddPassword] = useState<boolean>(false)
    const [appPassword, setAppPassword] = useState<AppPasswordResponse>({
        count: 0,
        data: []
    })

    const fetchAppPassword = async () => {
        try {
            const res = await AppPasswordAPI.getAll();
            if (res.status) {
                setAppPassword(res.result)
            }
        } catch (error) {
            console.log("error", error)
        }
    }

    useEffect(() => {
        fetchAppPassword()
    }, [])

    const colDefs: any = [
        { field: 'id', headerName: 'id', flex: 1, sortable: true },
        { field: 'eventName', headerName: 'Event Name', flex: 1, sortable: true },
        {
            field: 'updatedAt',
            headerName: 'Last updated',
            flex: 1,
            sortable: true,
            cellRenderer: (params: { data: IAppPassword }) => {
                const date = params?.data?.updatedAt as unknown as Date
                return (
                    <div className="flex items-center h-full">
                        {radDateFormatter(date)}
                    </div>
                );
            }
        },
        {
            field: 'isActive',
            headerName: 'Status',
            flex: 0.5,
            sortable: true,
            cellRenderer: (params: { data: IAppPassword }) => {
                const active = params?.data?.isActive as boolean;
                const handleSwitchChange = (newValue: boolean) => {
                    AppPasswordAPI.update(params.data.id, { isActive: newValue }).then(() => {
                        toast.success('Updated Successfully')
                        fetchAppPassword()
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
            cellRenderer: (params: { data: IAppPassword }) => {
                return <AppPasswordAction data={params.data} fetchAppPassword={fetchAppPassword} />;
            },
        },
    ];

    return (
        <DefaultLayout>
            {isAddPassword &&
                <AppPasswordCU
                    isOpen={isAddPassword}
                    toggleModal={() => setIsAddPassword(!isAddPassword)}
                    fetchLatestData={fetchAppPassword}
                />
            }
            <div>
                <BreadCrumb pageName='AppPassword' />
                <div className="flex gap-4 mb-8 justify-end">
                    <button >
                        <h4 className="text-xl rounded border bg-blue-500 text-gray px-5 py-1" onClick={() => setIsAddPassword(!isAddPassword)}>
                            {'Add App Password'}
                        </h4>
                    </button>
                </div>
                <div className="w-full h-full">
                    <div className="ag-theme-quartz h-[500px] pb-4">

                        <AgGridReact className="w-full" rowData={appPassword.data} columnDefs={colDefs} />

                    </div>
                    <div className='relative z-1 -mt-4'>
                        {appPassword?.count > 0 &&
                            <Pagination getRequestData={fetchAppPassword} total={appPassword.count} />
                        }
                    </div>
                </div>

            </div>
        </DefaultLayout>
    )
};

export default AppPassword;

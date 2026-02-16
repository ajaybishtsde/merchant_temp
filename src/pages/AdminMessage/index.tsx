import React, { useEffect, useState } from 'react';
import DefaultLayout from '@/layout/DefaultLayout';
import BreadCrumb from '@/components/common/ui/BreadCrumb';
import { AgGridReact } from 'ag-grid-react';
import Pagination from '@/components/common/ui/PaginationFooter';
import { toast } from 'react-toastify';
import SwitchInput from '@/components/ui/Switch';
import { radDateFormatter } from '@/utils';
import { AdminMessageAPI, AdminMessageResponse, IAdminMessage } from '@/utils/api/admin-message.api';
import AdminMessageAction from './component/AdminMessageAction';
import AdminMessageCU from './component/AdminMessageCU';

const AdminMessage = () => {
    const [isAddAdminMessage, setIsAddAdminMessage] = useState<boolean>(false)
    const [aAdminMessage, setAdminMessage] = useState<AdminMessageResponse>({
        count: 0,
        data: []
    })


    const fetchAdminMessage = async () => {
        try {
            const res = await AdminMessageAPI.getAll();
            if (res.status) {
                setAdminMessage(res.result)
            }
        } catch (error) {
            console.log("error", error)
        }
    }

    useEffect(() => {
        fetchAdminMessage()
    }, [])

    const colDefs: any = [
        { field: 'message', headerName: 'Message', flex: 1, sortable: true },
        {
            field: 'updatedAt',
            headerName: 'Last updated',
            flex: 1,
            sortable: true,
            cellRenderer: (params: { data: IAdminMessage }) => {
                const date = params?.data?.updatedAt as unknown as Date
                return (
                    <div className="flex items-center h-full">
                        {radDateFormatter(date)}
                    </div>
                );
            }
        },
        {
            field: 'createdAt',
            headerName: 'Created',
            flex: 1,
            sortable: true,
            cellRenderer: (params: { data: IAdminMessage }) => {
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
            cellRenderer: (params: { data: IAdminMessage }) => {
                const active = params?.data?.isActive as boolean;
                const handleSwitchChange = (newValue: boolean) => {
                    AdminMessageAPI.update(params.data.id, { isActive: newValue }).then(() => {
                        toast.success('Updated Successfully')
                        fetchAdminMessage()
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
            cellRenderer: (params: { data: IAdminMessage }) => {
                return <AdminMessageAction data={params.data} fetchAdminMessage={fetchAdminMessage} />;
            },
        },
    ];

    return (
        <DefaultLayout>
            {isAddAdminMessage &&
                <AdminMessageCU
                    isOpen={isAddAdminMessage}
                    toggleModal={() => setIsAddAdminMessage(!isAddAdminMessage)}
                    fetchLatestData={fetchAdminMessage}
                />
            }
            <div>
                <BreadCrumb pageName='AdminMessage' />
                <div className="w-full h-full">
                    <div className="ag-theme-quartz h-[500px] pb-4">

                        <AgGridReact className="w-full" rowData={aAdminMessage.data} columnDefs={colDefs} />

                    </div>
                    <div className='relative z-1 -mt-4'>
                        {aAdminMessage?.count > 0 &&
                            <Pagination getRequestData={fetchAdminMessage} total={aAdminMessage.count} />
                        }
                    </div>
                </div>

            </div>
        </DefaultLayout>
    )
};

export default AdminMessage;

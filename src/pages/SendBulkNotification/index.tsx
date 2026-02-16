import React, { useEffect, useState } from 'react';
import DefaultLayout from '@/layout/DefaultLayout';
import BreadCrumb from '@/components/common/ui/BreadCrumb';
import { AgGridReact } from 'ag-grid-react';
import Pagination from '@/components/common/ui/PaginationFooter';
import SendBulkNotificationAction from './component/SendBulkNotificationAction';
import SendBulkNotificationCU from './component/SendBulkNotificationCU';
import { IBulkNotification, SendBulkNotificationAPI, SendBulkNotificationResponse } from '@/utils/api/send-bulk-notification.api';
import { radDateFormatter } from '@/utils';


const SendBulkNotification = () => {
    const [isAddSendBulkNotification, setIsAddSendBulkNotification] = useState<boolean>(false)
    const [bulkNotification, setBulkNotification] = useState<SendBulkNotificationResponse>({
        count: 0,
        data: []
    })

    const toggleModal = () => {
        setIsAddSendBulkNotification(!isAddSendBulkNotification)
    }

    const fetchSendBulkNotification = async () => {
        try {
            const res = await SendBulkNotificationAPI.getAll();
            if (res.status) {
                setBulkNotification(res.result)
            }
        } catch (error) {
            console.log("error", error)
        }
    }

    useEffect(() => {
        fetchSendBulkNotification()
    }, [])

    const colDefs: any = [
        { field: 'title', headerName: 'Title', flex: 1, sortable: true },
        { field: 'message', headerName: 'Message', flex: 1, sortable: true },
        { field: 'type', headerName: 'Type', flex: 1, sortable: true },
        {
            field: 'isLink', headerName: 'Is Link', flex: 1, sortable: true,
            cellRenderer: (params: { data: IBulkNotification }) => {
                return (
                    <div>{`${params.data.isLink}`}</div>
                )
            }
        },
        {
            field: 'isStored', headerName: 'Is Stored', flex: 1, sortable: true,
            cellRenderer: (params: { data: IBulkNotification }) => {
                return (
                    <div>{`${params.data.isStored}`}</div>
                )
            }
        },
        {
            field: "createdAt", headerName: 'Sent At', flex: 1,
            sortable: true,
            cellRenderer: (params: { data: IBulkNotification }) => {
                const date = params?.data?.createdAt as unknown as Date
                return (
                    <div className="flex items-center h-full">
                        {radDateFormatter(date)}
                    </div>
                );
            }
        },
        {
            field: 'isEnabled',
            headerName: 'Actions',
            flex: 0.5,
            sortable: true,
            cellRenderer: (params: { data: IBulkNotification }) => {
                return <SendBulkNotificationAction data={params.data} fetchSendBulkNotification={fetchSendBulkNotification} />;
            },
        },
    ];
    return (
        <DefaultLayout>
            {isAddSendBulkNotification &&
                <SendBulkNotificationCU
                    isOpen={isAddSendBulkNotification}
                    toggleModal={toggleModal}
                    fetchLatestData={fetchSendBulkNotification}
                />
            }
            <div>
                <BreadCrumb pageName='Send Bulk Notification' />
                <div className="flex gap-4 mb-8 justify-end">
                    <button >
                        <h4 className="text-xl rounded border bg-blue-500 text-gray px-5 py-1" onClick={toggleModal}>
                            {'Add New Bulk Notification'}
                        </h4>
                    </button>
                </div>

                <div className="w-full h-full">
                    <div className="ag-theme-quartz h-[500px] pb-4">

                        <AgGridReact className="w-full" rowData={bulkNotification.data} columnDefs={colDefs} />

                    </div>
                    <div className='relative z-1 -mt-4'>
                        {bulkNotification?.count > 0 &&
                            <Pagination getRequestData={fetchSendBulkNotification} total={bulkNotification.count} />
                        }
                    </div>
                </div>

            </div>
        </DefaultLayout>
    )
};

export default SendBulkNotification;

import React, { useEffect, useState } from 'react';
import DefaultLayout from '@/layout/DefaultLayout';
import { toast } from 'react-toastify';
import SwitchInput from '@/components/ui/Switch';
import BreadCrumb from '@/components/common/ui/BreadCrumb';
import { AgGridReact } from 'ag-grid-react';
import Pagination from '@/components/common/ui/PaginationFooter';
import { EventResponse } from '@/utils/api/event.api';
import { EventTypeAPI, IEventType } from '@/utils/api/eventType.api';
import EventTypeCU from './component/EventTypeCU';
import EventTypeAction from './component/EventTypeAction';


const EventType = () => {
    const [isAddEventType, setIsAddEventType] = useState<boolean>(false)
    const [EventType, setEventType] = useState<EventResponse>({
        count: 0,
        data: []
    })

    const toggleModal = () => {
        setIsAddEventType(!isAddEventType)
    }

    const fetchEventType = async () => {
        try {
            const res = await EventTypeAPI.getAll();
            console.log("res: ", res)
            if (res.status) {
                setEventType(res.result)
            }
        } catch (error) {
            console.log("error", error)
        }
    }

    useEffect(() => {
        fetchEventType()
    }, [])

    const colDefs: any = [
        { field: 'name', headerName: 'Name', flex: 1, sortable: true },
        {
            field: 'isActive',
            headerName: 'Status',
            flex: 0.5,
            sortable: true,
            cellRenderer: (params: { data: IEventType }) => {
                const active = params?.data?.isActive as boolean;
                const handleSwitchChange = (newValue: boolean) => {
                    EventTypeAPI.updateStatus(params.data.id, newValue).then(() => {
                        toast.success('Updated Successfully')
                        fetchEventType()
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
            cellRenderer: (params: { data: IEventType }) => {
                return <EventTypeAction data={params.data} fetchEventType={fetchEventType} />;
            },
        },
    ];
    return (
        <DefaultLayout>
            {isAddEventType &&
                <EventTypeCU
                    isOpen={isAddEventType}
                    toggleModal={toggleModal}
                    fetchLatestData={fetchEventType}
                />
            }
            <div>
                <BreadCrumb pageName='Event Type' />
                <div className="flex gap-4 mb-8 justify-end">
                    <button >
                        <h4 className="text-xl rounded border bg-blue-500 text-gray px-5 py-1" onClick={toggleModal}>
                            {'Add New EventType'}
                        </h4>
                    </button>
                </div>

                <div className="w-full h-full">
                    <div className="ag-theme-quartz h-[500px] pb-4">

                        <AgGridReact className="w-full" rowData={EventType.data} columnDefs={colDefs} />

                    </div>
                    <div className='relative z-1 -mt-4'>
                        {EventType?.count > 0 &&
                            <Pagination getRequestData={fetchEventType} total={EventType.count} />
                        }
                    </div>
                </div>

            </div>
        </DefaultLayout>
    )
};

export default EventType;

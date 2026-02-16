import BreadCrumb from "@/components/common/ui/BreadCrumb"
import Pagination from "@/components/common/ui/PaginationFooter"
import DefaultLayout from "@/layout/DefaultLayout"
import { IWaitlist, WaitlistAPI } from "@/utils/api/waitlist.api"
import { AgGridReact } from "ag-grid-react"
import { useEffect, useState } from "react"
import WaitlistAction from "./component/WaitlistAction"
import { radDateFormatter } from "@/utils"

const WaitList = () => {
    const [waitList, setWaitlist] = useState({ count: 0, data: [] })

    const fetchWaitlist = async () => {
        try {
            const res = await WaitlistAPI.getAll();
            if (res.status) {
                setWaitlist(res.result)
            }
        } catch (error) {
            console.log("error", error)
        }
    }

    useEffect(() => {
        fetchWaitlist()
    }, [])
    

    const colDefs: any = [
        {
            field: 'name',
            headerName: 'Name',
            flex: 1,
            sortable: true,
            valueGetter: (params: { data: IWaitlist }) => `${params?.data?.firstName} ${params?.data?.lastName}`,
            resizable: true, minWidth: 150
        },
        {
            field: 'phone',
            headerName: 'Phone',
            flex: 1,
            sortable: true,
            valueGetter: (params: { data: IWaitlist }) => `${params?.data?.phoneNumber}`,
            resizable: true, minWidth: 150
        },
        { field: 'city', headerName: 'City', flex: 1, sortable: true, resizable: true, minWidth: 150 },
        { field: 'status', headerName: 'Status', flex: 1, sortable: true, resizable: true, minWidth: 150 },
        { field: 'interests', headerName: 'how will you use 4rl?', flex: 1, sortable: true, resizable: true, minWidth: 180 },
        {
            field: 'updatedAt',
            headerName: 'Last updated',
            flex: 1,
            sortable: true,
            resizable: true, minWidth: 150,
            cellRenderer: (params: { data: IWaitlist }) => {
                const date = params?.data?.updatedAt as unknown as Date
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
            cellRenderer: (params: { data: IWaitlist }) => {
                return <WaitlistAction data={params.data} fetchWaitlist={fetchWaitlist} />;
            },
            resizable: true, minWidth: 150
        },
    ];

    return (
        <DefaultLayout>
            <div>
                <BreadCrumb pageName='Waitlist' />
                <div className="w-full h-full ">
                    <div className="overflow-x-auto">
                        <div className="ag-theme-quartz min-w-[800px] h-[500px] pb-4">
                            <AgGridReact className="w-full" rowData={waitList.data} columnDefs={colDefs} />
                        </div>
                    </div>
                    <div className='relative z-1 -mt-4'>
                        {waitList?.count > 0 &&
                            <Pagination getRequestData={fetchWaitlist} total={waitList.count} />
                        }
                    </div>
                </div>

            </div>
        </DefaultLayout>
    )
}

export default WaitList;
import React from 'react'
import { AgGridReact } from 'ag-grid-react'
import AdminTableAction from './AdminTableAction'
import SwitchInput from '../ui/Switch';
import { radDateFormatter } from '@/utils';
import LoadingUI from '../common/ui/Loading';
import { AdminAPI, AdminResponse, IAdmin } from '@/utils/api/admin.api';
import { toast } from 'react-toastify';

interface ListAdminProps {
    adminData: AdminResponse;
    fetchAdmins: () => void;
}
const ListAdmin: React.FC<ListAdminProps> = ({ adminData, fetchAdmins }) => {

    const colDefs: any = [
        {
            field: 'name',
            headerName: 'First Name',
            flex: 1,
            filter: true,
            cellRenderer: (params: { data: IAdmin }) => {
                return (
                    <p className='first-letter:uppercase'>{params?.data?.firstName}</p>
                )
            }
        },
        {
            field: 'name',
            headerName: 'Last Name',
            flex: 1,
            filter: true,
            cellRenderer: (params: { data: IAdmin }) => {
                return (
                    <p className='first-letter:uppercase'>{params?.data?.lastName}</p>
                )
            }
        },
        { field: 'email', headerName: 'Email', flex: 1, filter: true },
        {
            field: 'createdAt',
            headerName: 'Date of Birth',
            flex: 1,
            sortable: true,
            cellRenderer: (params: { data: IAdmin }) => {
                const date = params?.data?.dob as unknown as Date
                return (
                    <div className="flex items-center h-full">
                        {radDateFormatter(date)}
                    </div>
                );
            }
        },
        {
            field: 'isActive',
            headerName: 'Active',
            flex: 0.5,
            filter: true,
            cellRenderer: (params: { data: IAdmin }) => {
                const active = params.data.isActive as boolean;

                const handleSwitchChange = (newValue: boolean) => {
                    AdminAPI.update(params.data.id, { isActive: newValue }).then(() => {
                        toast.success('Updated Successfully')
                        fetchAdmins()
                    })
                };

                return (
                    <div className="flex items-center h-full">
                        <SwitchInput
                            initialValue={active}
                            onChange={handleSwitchChange}
                        />
                    </div>
                );
            }
        },

        {
            field: 'Action',
            flex: 0.7,
            filter: true,
            cellRenderer: (params: { data: IAdmin }) => {
                return <AdminTableAction data={params.data} fetchAdmins={fetchAdmins} />;
            },
        },
    ];

    return (
        <div>
            <div className="ag-theme-quartz h-[500px] pb-4">
                <AgGridReact
                    className="w-full"
                    rowData={adminData.data}
                    columnDefs={colDefs}
                />
            </div>
        </div>
    )
}

export default ListAdmin
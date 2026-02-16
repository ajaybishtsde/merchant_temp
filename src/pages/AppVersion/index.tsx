import React, { useEffect, useState } from 'react';
import DefaultLayout from '@/layout/DefaultLayout';
import BreadCrumb from '@/components/common/ui/BreadCrumb';
import { AgGridReact } from 'ag-grid-react';
import Pagination from '@/components/common/ui/PaginationFooter';
import { AppVersionAPI, IAppVersion } from '@/utils/api/appVersion.api';
import AppVersionCU from './component/AppVersionCU';
import AppVersionAction from './component/AppversionAction';
import { AppVersionResponse } from '@/utils/api/appVersion.api';

const AppVersion = () => {
    const [isAddAppVersion, setIsAddAppVersion] = useState<boolean>(false)
    const [AppVersion, setAppVersion] = useState<AppVersionResponse>({
        count: 0,
        data: []
    })

    const toggleModal = () => {
        setIsAddAppVersion(!isAddAppVersion)
    }

    const fetchAppVersion = async () => {
        try {
            const res = await AppVersionAPI.getAll();
            console.log("res: ", res)
            if (res.status) {
                setAppVersion(res.result)
            }
        } catch (error) {
            console.log("error", error)
        }
    }

    useEffect(() => {
        fetchAppVersion()
    }, [])

    const colDefs: any = [
        { field: 'platform', headerName: 'Platform', flex: 1, sortable: true },
        { field: 'version', headerName: 'Version', flex: 1, sortable: true },
        { field: 'build', headerName: 'Build', flex: 1, sortable: true },
        {
            field: 'isForceUpdateRequire', headerName: 'Is Force Update Require', flex: 1, sortable: true,
            cellRenderer: (params: { data: IAppVersion }) => {
                return (
                    <div>{`${params.data.isForceUpdateRequire}`}</div>
                )
            }
        },
        {
            field: 'isEnabled',
            headerName: 'Actions',
            flex: 0.5,
            sortable: true,
            cellRenderer: (params: { data: IAppVersion }) => {
                return <AppVersionAction data={params.data} fetchAppVersion={fetchAppVersion} />;
            },
        },
    ];

    return (
        <DefaultLayout>
            {isAddAppVersion &&
                <AppVersionCU
                    isOpen={isAddAppVersion}
                    toggleModal={toggleModal}
                    fetchLatestData={fetchAppVersion}
                />
            }
            <div>
                <BreadCrumb pageName='App Version' />
                <div className="flex gap-4 mb-8 justify-end">
                    <button >
                        <h4 className="text-xl rounded border bg-blue-500 text-gray px-5 py-1" onClick={toggleModal}>
                            {'Add New AppVersion'}
                        </h4>
                    </button>
                </div>

                <div className="w-full h-full">
                    <div className="ag-theme-quartz h-[500px] pb-4">
                        <AgGridReact className="w-full" rowData={AppVersion.data} columnDefs={colDefs} />
                    </div>
                    <div className='relative z-1 -mt-4'>
                        {AppVersion?.count > 0 &&
                            <Pagination getRequestData={fetchAppVersion} total={AppVersion.count} />
                        }
                    </div>
                </div>

            </div>
        </DefaultLayout>
    )
};

export default AppVersion;

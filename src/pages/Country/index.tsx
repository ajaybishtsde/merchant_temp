import React, { useEffect, useState } from 'react';
import DefaultLayout from '@/layout/DefaultLayout';
import { toast } from 'react-toastify';
import SwitchInput from '@/components/ui/Switch';
import BreadCrumb from '@/components/common/ui/BreadCrumb';
import { AgGridReact } from 'ag-grid-react';
import Pagination from '@/components/common/ui/PaginationFooter';
import CountryAction from './component/CountryAction';
import CountryCU from './component/CountryCU';
import { CountryAPI, CountryResponse, ICountry } from '@/utils/api/country.api';


const Country = () => {
    const [isAddCountry, setIsAddCountry] = useState<boolean>(false)
    const [Country, setCountry] = useState<CountryResponse>({
        count: 0,
        data: []
    })

    const toggleModal = () => {
        setIsAddCountry(!isAddCountry)
    }

    const fetchCountry = async () => {
        try {
            const res = await CountryAPI.getAll();
            console.log("res: ", res)
            if (res.status) {
                setCountry(res.result)
            }
        } catch (error) {
            console.log("error", error)
        }
    }

    useEffect(() => {
        fetchCountry()
    }, [])

    const colDefs: any = [
        { field: 'name', headerName: 'Name', flex: 1, sortable: true },
        {
            field: 'isActive',
            headerName: 'Status',
            flex: 0.5,
            sortable: true,
            cellRenderer: (params: { data: ICountry }) => {
                const active = params?.data?.isActive as boolean;
                const handleSwitchChange = (newValue: boolean) => {
                    CountryAPI.updateStatus(params.data.id, newValue).then(() => {
                        toast.success('Updated Successfully')
                        fetchCountry()
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
            cellRenderer: (params: { data: ICountry }) => {
                return <CountryAction data={params.data} fetchCountry={fetchCountry} />;
            },
        },
    ];
    return (
        <DefaultLayout>
            {isAddCountry &&
                <CountryCU
                    isOpen={isAddCountry}
                    toggleModal={toggleModal}
                    fetchLatestData={fetchCountry}
                />
            }
            <div>
                <BreadCrumb pageName='Country' />
                <div className="flex gap-4 mb-8 justify-end">
                    <button >
                        <h4 className="text-xl rounded border bg-blue-500 text-gray px-5 py-1" onClick={toggleModal}>
                            {'Add New Country'}
                        </h4>
                    </button>
                </div>

                <div className="w-full h-full">
                    <div className="ag-theme-quartz h-[500px] pb-4">

                        <AgGridReact className="w-full" rowData={Country.data} columnDefs={colDefs} />

                    </div>
                    <div className='relative z-1 -mt-4'>
                        {Country?.count > 0 &&
                            <Pagination getRequestData={fetchCountry} total={Country.count} />
                        }
                    </div>
                </div>

            </div>
        </DefaultLayout>
    )
};

export default Country;

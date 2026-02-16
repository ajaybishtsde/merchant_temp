import React, { useEffect, useState } from 'react';
import DefaultLayout from '@/layout/DefaultLayout';
import BreadCrumb from '@/components/common/ui/BreadCrumb';
import { toast } from 'react-toastify';
import SwitchInput from '@/components/ui/Switch';
import { ISystemSetting, SystemSettingAPI } from '@/utils/api/system-setting.api';

const SystemSetting = () => {
    const [systemSetting, setSystemSetting] = useState<ISystemSetting | null>(null)

    const fetchSystemSetting = async () => {
        try {
            const res = await SystemSettingAPI.getAll();
            if (res.status) {
                setSystemSetting(res.result)
            }
        } catch (error) {
            console.log("error", error)
        }
    }

    const handleSwitchChange = async (newValue: boolean) => {
        try {
            SystemSettingAPI.update({ isUnderMaintenance: newValue }).then(() => {
                toast.success('Updated Successfully')
                fetchSystemSetting()
            });
        } catch (error) {
            console.log('error: ', error)
        }
    }

    useEffect(() => {
        fetchSystemSetting()
    }, [])

    return (
        <DefaultLayout>
            <div>
                <BreadCrumb pageName='System Setting' />
                <div className="w-full h-full flex items-center gap-6 py-3">
                    <div className='text-xl font-bold'>Is System Under Maintenance?</div>
                    <div className="flex items-center h-full">
                        <SwitchInput
                            initialValue={systemSetting?.isUnderMaintenance}
                            onChange={handleSwitchChange}
                        />
                    </div>
                </div>
            </div>
        </DefaultLayout>
    )
};

export default SystemSetting;

import React, { useEffect, useState } from 'react';
import DefaultLayout from '@/layout/DefaultLayout';
import BreadCrumb from '@/components/common/ui/BreadCrumb';
import { FiBarChart2, FiEye, FiCheckCircle } from 'react-icons/fi';
import { AdminAPI } from '@/utils/api/admin.api';

interface DashboardStats {
  redemptionRate: number;
  totalRedeemed: number;
  totalRevealed: number;
}

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    redemptionRate: 0,
    totalRedeemed: 0,
    totalRevealed: 0,
  });

  const getDashboardData = async () => {
    try {
      const res = await AdminAPI.getDashboardData();

      if (res?.status) {
        setStats(res.result);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getDashboardData();
  }, []);

  return (
    <DefaultLayout>
      <BreadCrumb pageName="Redemption Analytics" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Codes Revealed" value={stats.totalRevealed} icon={<FiEye size={22} />} />

        <StatCard
          title="Codes Redeemed"
          value={stats.totalRedeemed}
          icon={<FiCheckCircle size={22} />}
        />

        <StatCard
          title="Redemption Rate"
          value={`${stats.redemptionRate}%`}
          icon={<FiBarChart2 size={22} />}
        />
      </div>
    </DefaultLayout>
  );
};

export default Dashboard;

const StatCard = ({
  title,
  value,
  icon,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
}) => {
  return (
    <div className="bg-white rounded-xl shadow p-6 flex justify-between items-center text-black">
      <div>
        <div className="text-sm text-gray-500">{title}</div>
        <div className="text-2xl font-bold mt-1">{value}</div>
      </div>

      <div className="bg-gray-100 p-3 rounded-lg">{icon}</div>
    </div>
  );
};

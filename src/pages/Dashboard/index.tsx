import React, { useEffect, useState } from 'react';
import CardDataStats from '@/components/CardDataStats';
import DefaultLayout from '@/layout/DefaultLayout';
import BreadCrumb from '@/components/common/ui/BreadCrumb';
import { MdPlace } from 'react-icons/md';
import { MdEventAvailable } from 'react-icons/md';
import { IoMdChatboxes } from 'react-icons/io';
import { FaGlobeAmericas, FaMapMarked, FaMapMarkedAlt } from 'react-icons/fa';
import { BsArrowDownSquareFill } from 'react-icons/bs';
import { FaUsers } from 'react-icons/fa';
import { RiHotspotFill } from 'react-icons/ri';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AdminAPI, AdminQuery } from '@/utils/api/admin.api';
import { GiThreeFriends } from 'react-icons/gi';
import DashboardFilter from '@/components/filters/DashboardFilter';
import { FilterDashboardQuery } from '@/components/common/Interfaces/filter.interface';
import { FilterBar } from '@/components/filters';
import { TiUserDelete } from 'react-icons/ti';
import { FaTreeCity } from 'react-icons/fa6';
import { MdEvent } from 'react-icons/md';

interface StatItem {
  title: string;
  total: number;
  percentage?: string | number;
  levelUp?: boolean | null;
  levelDown?: boolean | null;
  icon: JSX.Element;
  link?: string;
}

const iconMap: { [key: string]: { link?: string; icon: JSX.Element } } = {
  'Accounts Created': {
    link: 'accounts-created',
    icon: <FaUsers className="text-3xl fill-primary dark:fill-white" />,
  },
  'Accounts Deleted': { icon: <TiUserDelete className="text-3xl fill-primary dark:fill-white" /> },
  connections: { icon: <GiThreeFriends className="text-3xl fill-primary dark:fill-white" /> },
  'Messages sent': { icon: <IoMdChatboxes className="text-3xl fill-primary dark:fill-white" /> },

  '3rd Places clicked': {
    link: 'experiences',
    icon: <MdPlace className="text-3xl fill-primary dark:fill-white" />,
  },
  'Functions Clicked': {
    link: 'experiences',
    icon: <MdEventAvailable className="text-3xl fill-primary dark:fill-white" />,
  },
  '3rd Places shared': {
    link: 'experiences',
    icon: <MdPlace className="text-3xl fill-primary dark:fill-white" />,
  },
  'Functions Shared': {
    link: 'experiences',
    icon: <MdEvent className="text-3xl fill-primary dark:fill-white" />,
  },

  'Daily Active Users': { icon: <FaUsers className="text-3xl fill-primary dark:fill-white" /> },
  'Dropped In Users': {
    link: 'neighborhood',
    icon: <BsArrowDownSquareFill className="text-2xl fill-primary dark:fill-white" />,
  },
  'Neighborhoods Live': {
    link: 'neighborhood',
    icon: <FaMapMarked className="text-3xl fill-primary dark:fill-white" />,
  },
  'Neighborhoods Active': {
    link: 'neighborhood',
    icon: <FaMapMarkedAlt className="text-3xl fill-primary dark:fill-white" />,
  },
  'Countries active': {
    icon: <FaGlobeAmericas className="text-2xl fill-primary dark:fill-white" />,
  },
  'Cities active': { icon: <FaTreeCity className="text-2xl fill-primary dark:fill-white" /> },
};

const Dashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<StatItem[]>([]);
  const [liveData, setLiveData] = useState<StatItem[]>([]);
  const [filter, setFilter] = useState<FilterDashboardQuery>({});
  const [activeFilters, setActiveFilters] = useState<{ [key: string]: string | boolean | any }>({});
  const [isOpenFilter, setIsOpenFilter] = useState<boolean>(false);
  const [isStatisticsUpdated, setIsStatisticsUpdated] = useState<boolean>(false);

  const mapStats = (dataObj: Record<string, any>): StatItem[] =>
    Object.entries(dataObj).map(([key, val]: any) => {
      const info = iconMap[key] || {};
      return {
        title: key,
        total: val.count,
        percentage: val.percentage ? `${val.percentage}%` : 'No change',
        levelUp: val.levelUp || null,
        levelDown: val.levelDown || null,
        icon: info.icon || <RiHotspotFill className="text-3xl fill-primary dark:fill-white" />,
        link: info.link ? `/${info.link}` : undefined,
      };
    });

  /** Fetch dashboard (filtered) and live (always unfiltered) */
  const fetchAllDashboardData = async (query?: AdminQuery) => {
    try {
      const res = await AdminAPI.getAlldata(query);
      if (res.status) {
        setDashboardData(mapStats(res.result.dashboard));
        setLiveData(mapStats(res.result.live));
      }
    } catch (error: any) {
      toast.error(error.message || 'something went wrong');
    }
  };

  /** Refresh stats manually */
  const updateStatistics = async () => {
    try {
      setIsStatisticsUpdated(true);
      await AdminAPI.updateStatistics();
      await fetchAllDashboardData();
      toast.success('Data updated sucsessfully');
    } catch (error: any) {
      toast.error(error.message || 'something went wrong');
    } finally {
      setIsStatisticsUpdated(false);
    }
  };

  /** Filter Handlers */
  const toggleFilterModal = () => {
    setIsOpenFilter(!isOpenFilter);
  };
  const handleFilterChange = <K extends keyof FilterDashboardQuery>(
    name: K,
    value: FilterDashboardQuery[K],
  ) => {
    setFilter({ ...filter, [name]: value });
  };
  const handleClearFilter = () => {
    setFilter({});
    setActiveFilters({});
    fetchAllDashboardData({});
  };
  const filterData = async () => {
    setActiveFilters(filter);
    await fetchAllDashboardData(filter);
  };
  const handleFilterCancel = async (filterKey: string) => {
    const updatedFilters = { ...activeFilters };
    delete updatedFilters[filterKey];
    setActiveFilters(updatedFilters);
    setFilter(updatedFilters);
    await fetchAllDashboardData(updatedFilters);
  };

  useEffect(() => {
    fetchAllDashboardData(filter);
  }, []);

  return (
    <DefaultLayout>
      {isOpenFilter && (
        <DashboardFilter
          isOpen={isOpenFilter}
          toggleModal={toggleFilterModal}
          clearFilter={handleClearFilter}
          handleFilter={handleFilterChange}
          state={filter}
          applyFilter={filterData}
        />
      )}
      <BreadCrumb pageName="" />
      <div className="flex gap-4 mb-8 justify-end">
        <h1
          className="text-xl rounded border bg-blue-500 text-gray px-5 py-1 cursor-pointer"
          onClick={updateStatistics}
        >
          {isStatisticsUpdated ? 'Updating..' : 'Refresh'}
        </h1>
        <h1
          className="text-xl rounded border bg-blue-500 text-gray px-5 py-1 cursor-pointer"
          onClick={toggleFilterModal}
        >
          Filter
        </h1>
        {Object.entries(activeFilters).length > 0 && (
          <FilterBar activeFilters={activeFilters} onFilterCancel={handleFilterCancel} />
        )}
      </div>

      {/* Dashboard Data */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        {dashboardData &&
          dashboardData.map((stat: any, index: any) => (
            <Link to={stat.link} key={index}>
              <CardDataStats
                title={stat.title}
                total={stat.total}
                rate={stat.percentage}
                levelUp={stat?.levelUp}
                levelDown={stat?.levelDown}
              >
                {stat.icon}
              </CardDataStats>
            </Link>
          ))}
      </div>

      <div className="pt-8">
        <h2 className="text-title-md2 font-semibold text-black dark:text-white first-letter:uppercase pt-5 pb-5">
          Live data
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
          {liveData &&
            liveData.map((stat: any, index: any) => (
              <Link to={stat.link} key={index}>
                <CardDataStats
                  title={stat.title}
                  total={stat.total}
                  rate={stat.percentage}
                  levelUp={stat?.levelUp}
                  levelDown={stat?.levelDown}
                >
                  {stat.icon}
                </CardDataStats>
              </Link>
            ))}
        </div>
      </div>
    </DefaultLayout>
  );
};

export default Dashboard;

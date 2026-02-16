import { LuPieChart } from 'react-icons/lu';
import { MdPlace } from 'react-icons/md';
import { IoSettingsSharp } from 'react-icons/io5';
import { BiSolidOffer } from 'react-icons/bi';

export const links = [
  {
    title: 'Dashboard',
    path: '/dashboard',
    pathnameInclude: 'dashboard',
    icon: <LuPieChart className="text-xl" />,
  },

  {
    title: 'Experiences',
    path: '/experiences',
    pathnameInclude: 'experiences',
    icon: <MdPlace className="text-xl" />,
  },
  {
    title: 'Place Offers',
    path: '/place-offer',
    pathnameInclude: 'place-offer',
    icon: <BiSolidOffer className="text-xl" />,
  },

  {
    title: 'System Setting',
    path: '/system-setting',
    pathnameInclude: 'system-setting',
    icon: <IoSettingsSharp className="text-xl" />,
  },
];

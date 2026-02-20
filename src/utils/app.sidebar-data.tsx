import { LuPieChart } from 'react-icons/lu';
import { MdPlace } from 'react-icons/md';
import { IoSettingsSharp, IoMale } from 'react-icons/io5';
import { BiSolidOffer } from 'react-icons/bi';

export const links = [
  {
    title: 'Dashboard',
    path: '/',
    pathnameInclude: '/',
    icon: <LuPieChart className="text-xl" />,
  },

  {
    title: 'Places',
    path: '/places',
    pathnameInclude: 'places',
    icon: <MdPlace className="text-xl" />,
  },
  {
    title: 'Place Offers',
    path: '/place-offer',
    pathnameInclude: 'place-offer',
    icon: <BiSolidOffer className="text-xl" />,
  },

  {
    title: 'Profile Setting',
    path: '/profile-setting',
    pathnameInclude: 'profile-setting',
    icon: <IoSettingsSharp className="text-xl" />,
  },
  {
    title: 'Account Setting',
    path: '/account-setting',
    pathnameInclude: 'account-setting',
    icon: <IoMale className="text-xl" />,
  },
];

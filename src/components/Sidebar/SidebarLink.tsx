import React, { useMemo } from 'react';
import { GrDown } from 'react-icons/gr';
import { NavLink, useLocation } from 'react-router-dom';
import SidebarLinkGroup from './SidebarLinkGroup';

interface SubLinkType {
  title: string;
  path: string;
}

interface SidebarLinkProps {
  link: {
    title: string;
    path?: string;
    icon: any;
    subLinks?: SubLinkType[];
    pathnameInclude: string;
  };
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ link: { title, path, icon, subLinks, pathnameInclude } }) => {
  const location = useLocation();
  const { pathname } = location;

  const isCurrentPath = useMemo(() => {
    return pathname === `/${pathnameInclude}` || pathname.includes(pathnameInclude);
  }, [pathname, pathnameInclude]);

  return (
    <li key={path}>
      {subLinks ? (
        <SidebarLinkGroup activeCondition={isCurrentPath}>
          {(handleClick, open) => (
            <>
              <div
                className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${open && 'bg-graydark dark:bg-meta-4'} cursor-pointer`}
                onClick={handleClick}
              >
                {icon}
                {title}
                <div>
                  <GrDown
                    className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${open && 'rotate-180'}`}
                  />
                </div>
              </div>
              {open && (
                <ul className="mb-5.5 mt-4 flex flex-col gap-2.5 pl-6">
                  {subLinks.map((subLink, index) => (
                    <li key={`${path}-${index}`}>
                      <NavLink
                        to={subLink.path}
                        className={({ isActive }) =>
                          'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                          (isActive && '!text-white')
                        }
                      >
                        {subLink.title}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </SidebarLinkGroup>
      ) : (
        <NavLink
          to={path || '/'}
          className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${isCurrentPath && 'bg-graydark dark:bg-meta-4'}`}
        >
          {icon}
          {title}
        </NavLink>
      )}
    </li>
  );
};

export default SidebarLink;

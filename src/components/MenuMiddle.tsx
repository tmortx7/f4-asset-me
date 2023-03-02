import Link from "next/link";
import { ReactNode } from "react";
import { VscNewFile } from "react-icons/vsc";

interface MenuItem {
  label: string;
  href?: string;
  icon?: ReactNode;
}

const generalMenuItems: MenuItem[] = [
  {
    label: "Create Site",
    href: "/site/new",
    icon: <VscNewFile className="ml-4" size={20} />,
  },
  {
    label: "Create Category",
    href: "/category/new",
    icon: <VscNewFile className="ml-4" size={20} />,
  },
  {
    label: "Create Loop",
    href: "/loop/new",
    icon: <VscNewFile className="ml-4" size={20} />,
  },
  {
    label: "Create Tag",
    href: "/tag/new",
    icon: <VscNewFile className="ml-4" size={20} />,
  },
  {
    label: "Create Log",
    href: "/log/new",
    icon: <VscNewFile className="ml-4" size={20} />,
  },
  {
    label: "Create Measured Variable",
    href: "/measuredvariable/new",
    icon: <VscNewFile className="ml-4" size={20} />,
  },
  {
    label: "Create Instrument Function",
    href: "/instrumentfunction/new",
    icon: <VscNewFile className="ml-4" size={20} />,
  },
  {
    label: "Create Instrument Type",
    href: "/instrumenttype/new",
    icon: <VscNewFile className="ml-4" size={20} />,
  },
  {
    label: "Create Manufacturer",
    href: "/manufacturer/new",
    icon: <VscNewFile className="ml-4" size={20} />,
  },
  {
    label: "Create Model",
    href: "/model/new",
    icon: <VscNewFile className="ml-4" size={20} />,
  },
  {
    label: "Create Asset",
    href: "/asset/new",
    icon: <VscNewFile className="ml-4" size={20} />,
  },
];

const moduleMenuItems: MenuItem[] = [
  {
    label: "Create Site",
    href: "/site/new",
    icon: <VscNewFile className="ml-4" size={20} />,
  },
]
const MenuMiddle = () => {
  return (
    <div className="z-50 h-[30px] border-b">
      <div className="dropdown dropdown-hover">
        <label tabIndex={0} className="ml-2 text-sm">
          File
        </label>
        <ul
          tabIndex={0}
          className="dropdown-content menu rounded-box  bg-base-200  text-sm shadow justify-start"
        >
          {generalMenuItems.map(({ label, href, icon }, i) => (
            <li key={`${label}-${i}`} className="">
              <div className="flex flex-row ">
                <div className="flex-grow-0">{icon}</div>
                <Link href={`${href}`}>
                  <p className="text-sm">{label}</p>
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MenuMiddle;

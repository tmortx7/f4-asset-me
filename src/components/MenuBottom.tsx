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
    label: "New Site",
    icon: <VscNewFile className="ml-4" size={20} />,
    href: "/site/new",
  },
  {
    label: "New Asset",
    icon: <VscNewFile className="ml-4" size={20} />,
    href: "/asset/new",
  },
  {
    label: "New Log",
    icon: <VscNewFile className="ml-4" size={20} />,
    href: "/log/new",
  },
  {
    label: "New Loop",
    icon: <VscNewFile className="ml-4" size={20} />,
    href: "/loop/new",
  },
   {
    label: "New Tag",
    icon: <VscNewFile className="ml-4" size={20} />,
    href: "/tag/new",
  },


];

const MenuBottom = () => {
  return (
    <div className="z-10 h-[60px] ml-2 border-b">
      <ul className="flex flex-row gap-4 ">
        {generalMenuItems.map(({ label, icon, href }, i) => (
          <li key={`${label}-${i}`} className="">
            <div className="mt-2 flex flex-col items-center">
              <Link href={`${href}`}>
                {icon}
                <span className="text-sm">{label}</span>
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MenuBottom;

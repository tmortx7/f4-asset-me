import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import router from "next/router";
import COC from "../assets/coc-logo.svg";

const MenuTop = () => {
  const { data: sessionData, status } = useSession();
  return (
    <div className="h-[25px]z-1 bg-gray-600">
      <div className="flex flex-row">
        <div className="flex basis-3/4 flex-row gap-4">
          <Link href="/">
            <COC className="ml-1 h-[25px]" />
          </Link>

          <p className="mt-1 text-sm font-semibold text-slate-50">
            Systems Instrumentation
          </p>
        </div>
        <div className="flex basis-1/4 flex-row justify-end">
        {status === "unauthenticated" && (
          <button onClick={()=>router.push('/login')} className=" mr-6 text-sm font-semibold  text-slate-50">
            sign-in
          </button>
        )}
        {status === "authenticated" && (
           <div className="dropdown-end dropdown">
            <label
              tabIndex={0}
              className=""
            >
              <div className="">
                <span className="text-sm font-semibold  text-slate-50 mr-6">{sessionData.user.name}</span>
              </div>
            </label>
            <ul
              tabIndex={0}
              className="dropdown-content menu rounded-box mt-4 w-52 bg-white text-black shadow"
            >
              <li className="hover:bg-gray-900 hover:text-white ">
                <button onClick={() => router.push("/user")}>Profile</button>
              </li>
              <li className="hover:bg-gray-900 hover:text-white">
                <button
                  onClick={() => {
                    signOut();
                    router.push("/");
                  }}
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>
        )}
        </div>
      </div>
    </div>
  );
};

export default MenuTop;

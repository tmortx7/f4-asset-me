import { Disclosure } from "@headlessui/react";
import Link from "next/link";
import { VscHome, VscDebugStackframe } from "react-icons/vsc";
import { api } from "../utils/api";

export const SideMenu = () => {
  const siteQuery = api.site.list.useQuery();
  return (
    <div className="mt-6">
      {siteQuery.data?.map((sitex) => {
        return (
          <div className="" key={sitex.id}>
            <Disclosure>
              <Disclosure.Button>
                <div className="flex flex-row">
                  <Link href={`/site/edit/${sitex.id}`}>
                    <VscHome size={20} className="ui-open ui-open:transform" />
                  </Link>
                  {sitex.site}
                </div>
              </Disclosure.Button>
              {sitex.loops.map((loopx, index) => {
                return (
                  <div key={index}>
                    <Disclosure.Panel>
                      <div className="ml-4 flex flex-row gap-2">
                        <VscDebugStackframe size={16} className="mt-1" />
                        <Link href={`/loop/edit/${loopx.id}`}>
                          {loopx.loop}
                        </Link>
                      </div>
                    </Disclosure.Panel>
                  </div>
                );
              })}
            </Disclosure>
          </div>
        );
      })}
    </div>
  );
};

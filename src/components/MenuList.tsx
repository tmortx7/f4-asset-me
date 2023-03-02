import { Disclosure } from "@headlessui/react";
import Link from "next/link";
import {
  VscHome,
  VscDebugStackframeActive,
  VscSymbolInterface,
} from "react-icons/vsc";
import { api } from "../utils/api";

export const MenuList = () => {
  const siteQuery = api.site.list.useQuery();

  return (
    <div className="mt-10 ml-4">
      <h1 className="text-center font-semibold ">INDEX</h1>
      {siteQuery.data?.map((sitex, index) => (
        <div key={index}>
          <Disclosure>
            <Disclosure.Button>
              <div className="flex flex-row">
                <Link href={`/site/edit/${sitex.id}`}>
                  <VscHome size={20} className="ui-open ui-open:transform" />
                </Link>
                <p className="tracking-tight">{sitex.site}</p>
              </div>
            </Disclosure.Button>

            {sitex.loops.map((loopx, index) => (
              <div key={index}>
                <Disclosure.Panel>
                  <Disclosure>
                    <Disclosure.Button>
                      <div className="ml-4 flex flex-row gap-1">
                        <Link href={`/loop/edit/${loopx.id}`}>
                          <VscDebugStackframeActive size={16} className="mt-1" />
                        </Link>
                        <p className="-tracking-2">{loopx.loop}</p>
                      </div>
                    </Disclosure.Button>
                    {loopx.tags.map((tag, index) => (
                      <div key={index}>
                        <Disclosure.Panel>
                          <div className="ml-8 flex flex-row gap-1">
                            <Link href={`/tags/edit/${tag.id}`}>
                              <VscSymbolInterface size={16} className="mt-1" />
                            </Link>
                            <p className="-tracking-2">{tag.tag}</p>
                          </div>
                        </Disclosure.Panel>
                      </div>
                    ))}
                  </Disclosure>
                </Disclosure.Panel>
              </div>
            ))}
          </Disclosure>
        </div>
      ))}
    </div>
  );
};

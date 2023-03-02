import Link from "next/link";
import { api } from "../utils/api";

type AppProps = {
  siteUUID: string
}
const SiteValue = ({ siteUUID }: AppProps) => {
  const siteQuery = api.site.byId.useQuery({ id: siteUUID });
  return <div>{siteQuery.data?.site}</div>;
};

export const LogTable = () => {
  const logQuery = api.log.list.useQuery();

  const DateTime = ({timex}:any) => {
    const date = new Date(timex);
    const value = date.toLocaleString()
    return(
      <div>
        <p>{value}</p>
      </div>

    )
  }

  return (
    <div className="mt-6 flex flex-row max-w-md h-[600px]">
      <div className="overflow-x-auto">
        <table className="table table-compact w-full border-2 ">
          <thead>
            <tr>
              <th>date</th>
              <th>log</th>
              <th>Site</th>
            </tr>
          </thead>
          <tbody className="overflow-auto">
            {logQuery.data?.map(({ id, log, siteId, createdAt }) => (
              <tr key={id}className="text-left">
                <td className="w-1/4">
                  {<DateTime timex={createdAt}/>}
                </td>
                <td className="whitespace-pre-wrap truncate">
                  <Link href={`/log/edit/${id}`}><p className="" >{log}</p></Link>
                </td>
                <td className="w-1/4">
                  <SiteValue siteUUID={siteId} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

import Link from "next/link";
import { api } from "../utils/api";

export const InstrumentFunctionTable = () => {
  const instrumentfunctionQuery = api.instrumentfunction.list.useQuery();
  return (
    <div className="mt-6 flex flex-row ">
      <div className="overflow-x-auto">
        <table className="table-compact table border-2 p-4">
          <thead>
            <tr>
              <th>Function</th>
              <th>Alias</th>
            </tr>
          </thead>
          <tbody>
            {instrumentfunctionQuery.data?.map(({ id, functionx, alias }) => (
              <tr key={id}>
                <td>
                  <Link href={`/instrumentfunction/edit/${id}`}>{functionx}</Link>
                </td>
                <td>{alias}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

import Link from "next/link";
import { api } from "../utils/api";

export const MeasuredVariableTable = () => {
  const measuredvariableQuery = api.measuredvariable.list.useQuery();
  return (
    <div className="mt-6 flex flex-row ">
      <div className="overflow-x-auto">
        <table className="table-compact table border-2 p-4">
          <thead>
            <tr>
              <th>Variable</th>
              <th>Alias</th>
            </tr>
          </thead>
          <tbody>
            {measuredvariableQuery.data?.map(({ id, variablex, alias }) => (
              <tr key={id}>
                <td>
                  <Link href={`/measuredvariable/edit/${id}`}>{variablex}</Link>
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

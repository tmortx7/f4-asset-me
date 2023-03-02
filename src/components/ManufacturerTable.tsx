import Link from "next/link";
import { api } from "../utils/api";

export const ManufacturerTable = () => {
  const manQuery = api.manufacturer.list.useQuery();
  return (
    <div className="mt-6 flex flex-row ">
      <div className="overflow-x-auto">
        <table className="table-compact table border-2 p-4">
          <thead>
            <tr>
              <th>Manufacturer</th>
              <th>Note</th>
            </tr>
          </thead>
          <tbody>
            {manQuery.data?.map(({ id,name,note  }) => (
              <tr key={id}>
                <td>
                  <Link href={`/manufacturer/edit/${id}`}>{name}</Link>
                </td>
                <td>{note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

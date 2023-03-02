import Link from "next/link";
import NextError from 'next/error';
import { api } from "../utils/api";

export const AssetTable = () => {
  const assetQuery = api.asset.list.useQuery();

   if (assetQuery.error) {
    return (
      <NextError
        title={assetQuery.error.message}
        statusCode={assetQuery.error.data?.httpStatus ?? 500}
      />
    );
  }

  if (assetQuery.status !== 'success') {
    return <>Loading...</>;
  }
  return (
    <div className="mt-6 flex flex-row ">
      <div className="overflow-x-auto">
        <table className="table-compact table border-2 p-4">
          <thead>
            <tr>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {assetQuery.data?.map(({ id, description }) => (
              <tr key={id}>
                <td>
                  <Link href={`/asset/edit/${id}`}>{description}</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

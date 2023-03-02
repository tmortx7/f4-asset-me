import Link from "next/link";
import { api } from "../utils/api";

const MeasuredValue = ({ mvUUID }: any) => {
  const mvQuery = api.measuredvariable.byId.useQuery({ id: mvUUID });
  return <div>{mvQuery.data?.variablex}</div>;
};

const InstValue = ({ instUUID }: any) => {
  const instQuery = api.instrumentfunction.byId.useQuery({ id: instUUID });
  return <div>{instQuery.data?.functionx}</div>;
};

export const InstrumentTypeTable = () => {
  const typeQuery = api.instrumenttype.list.useQuery();
  return (
    <div className="mt-6 flex flex-row ">
      <div className="overflow-x-auto">
        <table className="table-compact table border-2 p-4 tracking-tight">
          <thead>
            <tr>
              <th>Variable</th>
              <th>Function</th>
              <th>Type</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {typeQuery.data?.map(
              ({ id, mvId, instfunctionId, type, description }) => (
                <tr key={id}>
                  <td>
                    <MeasuredValue mvUUID={mvId} />
                  </td>
                  <td>
                    <InstValue instUUID={instfunctionId} />
                  </td>
                  <td>
                    <Link href={`/instrumenttype/edit/${id}`}>{type}</Link>
                  </td>
                  <td>
                    <Link href={`/instrumenttype/edit/${id}`}>
                      {description}
                    </Link>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

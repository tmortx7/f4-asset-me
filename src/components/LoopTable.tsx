import Link from "next/link";
import NextError from 'next/error';
import { api } from "../utils/api";

const MeasuredValue = ({ mvUUID }: any) => {
  const mvQuery = api.measuredvariable.byId.useQuery({ id: mvUUID });
  return <div>{mvQuery.data?.variablex}</div>;
};

export const LoopTable = () => {
  const loopQuery = api.loop.list.useQuery();

   if (loopQuery.error) {
    return (
      <NextError
        title={loopQuery.error.message}
        statusCode={loopQuery.error.data?.httpStatus ?? 500}
      />
    );
  }

  if (loopQuery.status !== 'success') {
    return <>Loading...</>;
  }
  return (
    <div className="mt-6 flex flex-row ">
      <div className="overflow-x-auto">
        <table className="table-compact table border-2 p-4">
          <thead>
            <tr>
              <th>Variable</th>
              <th>Loop</th>
              <th>Numberic</th>
              <th>Service</th>
            </tr>
          </thead>
          <tbody>
            {loopQuery.data?.map(({ id, loop, numberic, service,mvId }) => (
              <tr key={id}>
                <td><MeasuredValue mvUUID={mvId} /></td>
                <td>
                  <Link href={`/loop/edit/${id}`}><p className="-tracking-2">{loop}</p></Link>
                </td>
                <td>
                  {numberic}
                </td>
                <td>
                  {service}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

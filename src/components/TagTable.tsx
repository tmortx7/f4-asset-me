import Link from "next/link";
import NextError from "next/error";
import { api } from "../utils/api";

const InstrumentTypeValue = ({ typeUUID }: any) => {
  const typeQuery = api.instrumenttype.byId.useQuery({ id: typeUUID });
  return <div className="font-normal">{typeQuery.data?.description}</div>;
};
export const TagTable = () => {
  const utils = api.useContext();
  const mutation = api.looptag.delete.useMutation({
    async onSuccess() {
      await utils.looptag.list.invalidate();
    },
  });
  const tagQuery = api.looptag.list.useQuery();

  if (tagQuery.error) {
    return (
      <NextError
        title={tagQuery.error.message}
        statusCode={tagQuery.error.data?.httpStatus ?? 500}
      />
    );
  }

  if (tagQuery.status !== "success") {
    return <>Loading...</>;
  }
  return (
    <div className="mt-6 flex flex-row ">
      <div className="overflow-x-auto">
        <table className="table-compact table border-2 p-4">
          <thead>
            <tr>
              <th>tag</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tagQuery.data?.map(({ id, tag, typeId }) => (
              <tr key={id}>
                <td>
                  <Link href={`/tag/edit/${id}`}>
                    <p className="font-extralight">{tag}</p>
                  </Link>
                </td>
                <th><InstrumentTypeValue typeUUID={typeId} /></th>
                <td>
                  <label
                    className=""
                    onClick={() => mutation.mutate({ id })}
                  >delete</label>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

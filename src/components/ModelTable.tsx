import Link from "next/link";
import { api } from "../utils/api";

const ManufacturerValue = ({manUUID}:any) => {
  const manQuery = api.manufacturer.byId.useQuery({ id:manUUID });
  return(
    <div>
      {manQuery.data?.name}
    </div>
  )
}

export const ModelTable = () => {
  const modelQuery = api.model.list.useQuery();
  return (
    <div className="flex flex-row mt-6 ">
      <div className="overflow-x-auto">
        <table className="table-compact table p-4 border-2">
          <thead>
            <tr>
              <th>model</th>
              <th>serial</th>
              <th>manufacturer</th>
              <th>Note</th>
            </tr>
          </thead>
          <tbody>
            {modelQuery.data?.map(({ id, model, serialno,note,manufacturerId }) => (

                <tr key={id}>
                  <td><Link href={`/model/edit/${id}`}>{model}</Link></td>
                  <td>{serialno}</td>
                  <td><ManufacturerValue manUUID= {manufacturerId}/></td>
                  <td>{note}</td>
                </tr>

            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

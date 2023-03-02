import Link from "next/link";
import { api } from "../utils/api";

const CategoryValue = ({catUUID}:any) => {
  const categoryQuery = api.category.byId.useQuery({ id:catUUID });
  return(
    <div>
      {categoryQuery.data?.category}
    </div>
  )
}

export const SiteTable = () => {
  const siteQuery = api.site.list.useQuery();
  return (
    <div className="flex flex-row mt-6 ">
      <div className="overflow-x-auto">
        <table className="table-compact table p-4 border-2">
          <thead>
            <tr>
              <th>Name</th>
              <th>Alias</th>
              <th>Category</th>
              <th>Note</th>
            </tr>
          </thead>
          <tbody>
            {siteQuery.data?.map(({ id, site, alias, note, categoryId }) => (

                <tr key={id}>
                  <td><Link href={`/site/edit/${id}`}>{site}</Link></td>
                  <td>{alias}</td>
                  <td><CategoryValue catUUID= {categoryId}/></td>
                  <td>{note}</td>
                </tr>

            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

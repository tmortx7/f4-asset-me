import Link from "next/link";
import { api } from "../utils/api";

export const CategoryTable = () => {
  const categoryQuery = api.category.list.useQuery();
  return (
    <div className="mt-6 flex flex-row ">
      <div className="overflow-x-auto">
        <table className="table-compact table border-2 p-4">
          <thead>
            <tr>
              <th>Category</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {categoryQuery.data?.map(({ id, category, description }) => (
              <tr key={id}>
                <td>
                  <Link href={`/category/edit/${id}`}>{category}</Link>
                </td>
                <td>{description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

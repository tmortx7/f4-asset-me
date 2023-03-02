import { api } from "~/utils/api";

export const ProductList = () => {
  const { data, isLoading, error } = api.product.list.useQuery();
  if (isLoading) {
    return <p> Loading...</p>;
  }
  if (error) {
    return <p>Error...</p>;
  }

  return (
    <div className="flex flex-row justify-center">
      <div className="flex flex-col">
        <input className="input-bordered input w-full "></input>
        <div className="overflow-x-auto">
          <table className="table-compact table border-2 p-4 min-w-xl w-full">
            <thead>
              <tr>
                <th>name</th>
                <th>price</th>
              </tr>
            </thead>
            <tbody>
              {data?.map(({ id, name, price }) => (
                <tr key={id}>
                  <td>{name}</td>
                  <td>{price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

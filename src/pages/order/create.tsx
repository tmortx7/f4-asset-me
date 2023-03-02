import PlainLayout from "~/components/PlainLayout";
import { ProductList } from "~/components/products-list";


const HomePage = () => {
  return (
    <div className="flex flex-row w-full h-[100vh]">
        <div className=" basis-1/2 bg-red-100 w-full">
					<ProductList/>
        </div>
        <div className="basis-1/2 bg-blue-100 w-full">

        </div>
      </div>

  );
};

HomePage.getLayout = function getLayout(page: React.ReactElement) {
  return <PlainLayout>{page}</PlainLayout>;
};
export default HomePage;

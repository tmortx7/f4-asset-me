import { CategoryTable } from "../components/CategoryTable";
import { LogTable } from "../components/LogTable";
import MainLayout from "../components/MainLayout";
import { MenuList } from "../components/MenuList";
import { SideMenu } from "../components/SideMenu";
import { TagTable } from "../components/TagTable";

const HomePage = () => {
  return (
    <div className="flex flex-row w-full">
        <div className=" w-full">
          <CategoryTable />
          <LogTable />
          <TagTable />
        </div>
        <div className="basis-1/4 border">
          <MenuList />
        </div>
      </div>

  );
};

HomePage.getLayout = function getLayout(page: React.ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};
export default HomePage;


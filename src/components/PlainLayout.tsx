import { FC } from "react";
import MenuBottom from "./MenuBottom";
import MenuMiddle from "./MenuMiddle";
import MenuTop from "./MenuTop";

type AppProps = {
  children: React.ReactNode;
};

const PlainLayout: FC<AppProps> = ({ children }) => {
  return (
      <div className="z-0 flex h-[100vh] w-full flex-col ">
        <MenuTop />
        <MenuMiddle />
        {children}
      </div>
  );
};
export default PlainLayout;

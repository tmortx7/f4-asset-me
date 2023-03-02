import { CreateMeasuredVariable } from "../../../components/CreateMeasuredVariable"
import type { GetServerSideProps, NextPage } from "next";
import { unstable_getServerSession as getServerSession } from "next-auth";
import { authOptions } from "~/server/auth";

const CreateMeasuredVariablePage = () => {
	return(
		<div className="flex flex-row justify-center">
			<div className="p-[50px] bg-slate-100 mt-10 border-2 rounded">
				<CreateMeasuredVariable />
			</div>

		</div>
	)
}
export default CreateMeasuredVariablePage
export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getServerSession(req, res, authOptions);

  if (!session?.user) {
    return {
      redirect: {
        destination: "/login",
        permanent: true,
      },
      props: {},
    };
  }

  return {
    props: {
      session,
    },
  };
};

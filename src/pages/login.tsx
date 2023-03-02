import type { GetSessionParams } from "next-auth/react";
import { getSession } from "next-auth/react";
import { LoginForm } from "~/components/LoginForm";

const LoginRoute = () => {
  return (
    <div className="flex flex-row w-full">
      <LoginForm />
    </div>
  );
};

export async function getServerSideProps(context: GetSessionParams) {
  const session = await getSession(context);

  if (session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      currentSession: session,
    },
  };
}

export default LoginRoute;

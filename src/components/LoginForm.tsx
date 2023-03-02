import { signIn } from "next-auth/react";
import router from "next/router";
import type { FormEvent } from "react";
import { useState } from "react";
import { api } from "~/utils/api";

const LoginForm = () => {
  const [emailLogin, setEmailLogin] = useState<string>("");

  const [passwordLogin, setPasswordLogin] = useState<string>("");
  const [loginError, setLoginError] = useState<boolean>(false);

  const user = api.user.findUser.useQuery(
    {
      email: emailLogin,
      password: passwordLogin,
    },
    { enabled: false }
  );

  async function handleSubmitLogin(e: FormEvent) {
    e.preventDefault();

    const data = await user.refetch();

    if (!data.data) {
      setLoginError(true);
      return;
    }

    setLoginError(false);

    try {
      await signIn("credentials", {
        email: data?.data?.email,
        password: data?.data.password,
        redirect: true,
      });
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="mt-[100px] flex w-full flex-row justify-center">
      <div className="flex flex-col">
        <h1 className="text-3xl font-bold">Login</h1>
        <form
          onSubmit={handleSubmitLogin}
          className=" mt-5 flex w-full flex-col items-center gap-2"
        >
          <div className="form-control w-full max-w-xs">
            <input
              type="email"
              name=""
              id=""
              placeholder="Email"
              onChange={(e) => setEmailLogin(e.target.value)}
              className="input-bordered input w-full max-w-xs"
            />
          </div>
          <div className="form-control w-full max-w-xs">
            <input
              type="password"
              name=""
              id=""
              placeholder="Password"
              onChange={(e) => setPasswordLogin(e.target.value)}
              className="input-bordered input w-full max-w-xs"
            />
          </div>
          {loginError && <p className="text-red-600">Invalid data</p>}
          <div className="form-control w-full max-w-xs">
            <button type="submit" className="btn-info btn w-full max-w-xs">
              Continue
            </button>
            <button
              className="btn mt-4 w-full max-w-xs"
              onClick={() => signIn("google")}
            >
              Sign in with Google
            </button>
          </div>
        </form>
        <div className="divider mt-[30px]">New to CSS??</div>
        <button
          className="btn btn-warning mt-4 w-full max-w-xs"
          onClick={() => router.push("/user/new")}
        >
          Create your CSS account
        </button>
      </div>
    </div>
  );
};

export { LoginForm };

import type { FormikHelpers } from "formik";
import { Formik, Form } from "formik";
import { useRouter } from "next/router";
import { z } from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { api } from "~/utils/api";
import Meta from "./Meta";
import { TextField } from "./TextField";

const RegisterSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(4),
});

type IRegister = z.infer<typeof RegisterSchema>;

export const RegisterForm = () => {
  const router = useRouter();
  const mutation = api.user.add.useMutation({
    async onSuccess() {
      try {
        await router.push("/");
      } catch (e) {
        console.log(e);
      }
    },
  });
  return (
    <>
      <Meta
        title="HomePage"
        description="HomePage- starter page"
        image="/favicon.png"
      />
      <div className="mt-[100px] flex w-full flex-row justify-center">
        <div className="p-[50px] shadow">
          <p className="mb-6 font-sans text-5xl">Register!!</p>
          <Formik<IRegister>
            validateOnBlur={false}
            validateOnChange={false}
            initialValues={{
              name: "",
              email: "",
              password: "",
            }}
            validationSchema={toFormikValidationSchema(RegisterSchema)}
            onSubmit={(values: IRegister) => {
              try {
                mutation.mutate(values);
              } catch (e) {
                console.log(e);
              }
            }}
          >
            <Form>
              <TextField name="name" label="Name" autoComplete="off" />
              <TextField
                name="email"
                label="Email"
                type="email"
                autoComplete="off"
              />
              <TextField
                name="password"
                label="Password"
                type="password"
                autoComplete="off"
              />
              {mutation.isError ? (
                <div className="text-red-500">
                  An error occurred: {mutation.error.message}
                </div>
              ) : null}

              <button className="btn mt-4 w-full max-w-xs" type="submit">
                Submit
              </button>
            </Form>
          </Formik>
        </div>
      </div>
    </>
  );
};

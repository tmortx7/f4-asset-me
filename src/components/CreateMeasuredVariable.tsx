import { Form, Formik, FormikProps } from "formik";
import { useRouter } from "next/router";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { IMeasuredVariableSchema, MeasuredVariableSchema } from "../schema/measuredvariable.schema";
import { api } from "../utils/api";
import { TextField } from "./formik/TextField";

export const CreateMeasuredVariable = () => {
  const utils = api.useContext();
  const router = useRouter();
  const mutation = api.measuredvariable.add.useMutation({
    async onSuccess() {
      await utils.measuredvariable.list.invalidate();
    },
  });
  return (
    <div className="">
			<h1 className="text-5xl text-bold">Create Measured Variable!</h1>
			<p className="text-xs mt-6 w-full text-center">Generate measured variable such as flow, pressure and temperature </p>
      <Formik<IMeasuredVariableSchema>
        initialValues={{
          variablex: " ",
          alias: " ",
        }}
        validationSchema={toFormikValidationSchema(MeasuredVariableSchema)}
        onSubmit={async (values: IMeasuredVariableSchema) => {
          mutation.mutate(values);
          router.push("/");
        }}
      >
        {(props: FormikProps<any>) => (
          <Form>
            <TextField
              name="variablex"
              type="text"
              label="Variable"
              autoComplete="off"
            />
            <TextField
              name="alias"
              type="text"
              label="Alias"
              autoComplete="off"
            />


            <div className="flex flex-row gap-2">
              <button className="btn-outlined btn mt-4 justify-evenly " type="submit">
                Add
              </button>
							<button className="btn btn-outlined mt-4" type="button" onClick={()=>router.push("/")}>
								Cancel
							</button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

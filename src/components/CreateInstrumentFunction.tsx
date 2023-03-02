import { Form, Formik, FormikProps } from "formik";
import { useRouter } from "next/router";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { IInstrumentFunctionSchema, InstrumentFunctionSchema } from "../schema/instrumentfunction.schema";
import { api } from "../utils/api";
import { TextField } from "./formik/TextField";

export const CreateInstrumentFunction = () => {
  const utils = api.useContext();
  const router = useRouter();
  const mutation = api.instrumentfunction.add.useMutation({
    async onSuccess() {
      await utils.instrumentfunction.list.invalidate();
    },
  });
  return (
    <div className="">
			<h1 className="text-5xl text-bold">Create Instrument Function!</h1>
			<p className="text-xs mt-6 w-full text-center">Generate instrument functions such as alarm, transmitter, gauge</p>
      <Formik<IInstrumentFunctionSchema>
        
        initialValues={{
          functionx: " ",
          alias: " ",
        }}
        validationSchema={toFormikValidationSchema(InstrumentFunctionSchema)}
        onSubmit={async (values: IInstrumentFunctionSchema) => {
          mutation.mutate(values);
          router.push("/");
        }}
      >
        {(props: FormikProps<any>) => (
          <Form>
            <TextField
              name="functionx"
              type="text"
              label="Function"
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

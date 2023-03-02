import { Field, Form, Formik, FormikProps } from "formik";
import { useRouter } from "next/router";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { IInstrumentTypeSchema, InstrumentTypeSchema } from "../schema/instrumenttype.schema";
import { api } from "../utils/api";
import { TextField } from "./formik/TextField";

export const CreateInstrumentType = () => {
  const utils = api.useContext();
  const router = useRouter();
  const mutation = api.instrumenttype.add.useMutation({
    async onSuccess() {
      await utils.instrumenttype.list.invalidate();
    },
  });
   const mvQuery = api.measuredvariable.list.useQuery();
    const instQuery = api.instrumentfunction.list.useQuery();
  return (
    <div className="">
			<h1 className="text-5xl text-bold">Create Instrument Type!</h1>
			<p className="text-xs mt-6 w-full text-center">Generate instrument types such as ft, tit, fe</p>
      <Formik<IInstrumentTypeSchema>
        initialValues={{
          type: " ",
          mvId: "",
          instfunctionId: " ",
          description: "",
        }}
        validationSchema={toFormikValidationSchema(InstrumentTypeSchema)}
        onSubmit={async (values: IInstrumentTypeSchema) => {
          mutation.mutate(values);
          router.push("/");
        }}
      >
        {(props: FormikProps<any>) => (
          <Form>
            <div className="form-control w-full">
              <label className="label">
                <p className="label-text">Measured Variable</p>
              </label>
              <Field
                className="select-bordered select w-full"
                as="select"
                name="mvId"
                required
              >
                <option value="">(Select a variable)</option>
                {mvQuery.data?.map((mvx: any) => (
                  <option value={mvx.id}>{mvx.variablex}</option>
                ))}
              </Field>
            </div>

            <div className="form-control w-full">
              <label className="label">
                <p className="label-text">Instrument Type</p>
              </label>
              <Field
                className="select-bordered select w-full"
                as="select"
                name="instfunctionId"
                required
              >
                <option value="">(Select a inst function)</option>
                {instQuery.data?.map((instx: any) => (
                  <option value={instx.id}>{instx.functionx}</option>
                ))}
              </Field>
            </div>
            <TextField
              name="description"
              type="text"
              label="Description"
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

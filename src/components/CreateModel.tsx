import { Field, Form, Formik, FormikProps } from "formik";
import { useRouter } from "next/router";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { IModelSchema, ModelSchema } from "../schema/model.schema";
import { api } from "../utils/api";
import { TextAreaField } from "./formik/TextAreaField";
import { TextField } from "./formik/TextField";

export const CreateModel = () => {
  const utils = api.useContext();
  const router = useRouter();
  const mutation = api.model.add.useMutation({
     async onSuccess() {
      await utils.model.list.invalidate();
    },
  });
  const manQuery = api.manufacturer.list.useQuery();
  return (
    <div className="">
			<h1 className="text-5xl text-bold">Create Model!</h1>
			<p className="text-xs mt-6 w-full text-center">Generate manufacturer models for sites</p>
      <Formik<IModelSchema>
        initialValues={{
          model: " ",
          serialno: " ",
          note: " ",
          manufacturerId: "",
        }}
        validationSchema={toFormikValidationSchema(ModelSchema)}
        onSubmit={async (values: IModelSchema) => {
          mutation.mutate(values);
          router.push("/");
        }}
      >
        {(props: FormikProps<any>) => (
          <Form>
            <div className="form-control w-full">
              <label className="label">
                <p className="label-text">Manfacturer</p>
              </label>
              <Field
                className="select-bordered select w-full"
                as="select"
                name="manufacturerId"
                required
              >
                <option value="">(Select a manufacturer)</option>
                {manQuery.data?.map((manx: any) => (
                  <option value={manx.id}>{manx.name}</option>
                ))}
              </Field>
            </div>
            <TextField
              name="model"
              type="text"
              label="Model"
              autoComplete="off"
            />
            <TextField
              name="serialno"
              type="text"
              label="Serial Number"
              autoComplete="off"
            />
            <TextAreaField
              name="note"
              label="Note"
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

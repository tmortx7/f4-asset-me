import { Form, Formik, FormikProps } from "formik";
import { useRouter } from "next/router";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { IManufacturerSchema, ManufacturerSchema } from "../schema/manufacturer.schema";
import { api } from "../utils/api";
import { TextAreaField } from "./formik/TextAreaField";
import { TextField } from "./formik/TextField";

export const CreateManufacturer = () => {
  const utils = api.useContext();
  const router = useRouter();
  const mutation = api.manufacturer.add.useMutation({
    async onSuccess() {
      await utils.manufacturer.list.invalidate();
    },
  });
  return (
    <div className="">
			<h1 className="text-5xl text-bold">Create Manufacturer!</h1>
			<p className="text-xs mt-6 w-full text-center">Generate manufacturer of product</p>
      <Formik<IManufacturerSchema>
        initialValues={{
          name: " ",
          note: " ",
        }}
        validationSchema={toFormikValidationSchema(ManufacturerSchema)}
        onSubmit={async (values: IManufacturerSchema) => {
          mutation.mutate(values);
          router.push("/");
        }}
      >
        {(props: FormikProps<any>) => (
          <Form>
            <TextField
              name="name"
              type="text"
              label="Name"
              autoComplete="off"
            />

            <TextAreaField
              name="note"
              type="text"
              label="Note"
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

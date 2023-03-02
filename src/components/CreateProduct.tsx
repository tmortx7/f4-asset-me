import { Field, Form, Formik, FormikProps } from "formik";
import { useRouter } from "next/router";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { IProductSchema, ProductSchema } from "../schema/product.schema";
import { api } from "../utils/api";
import { TextAreaField } from "./formik/TextAreaField";
import { TextField } from "./formik/TextField";

export const CreateProduct = () => {
  const utils = api.useContext();
  const router = useRouter();
  const mutation = api.product.add.useMutation({
    async onSuccess() {
      await utils.product.list.invalidate();
    },
  });
  return (
    <div className="">
			<h1 className="text-5xl text-bold">Create Product!</h1>
			<p className="text-xs mt-6 w-full text-center">Generate products such as terminal blocks, power supplies</p>
      <Formik<IProductSchema>
        initialValues={{
          name: " ",
          price: 10,
          description: " ",
        }}
        validationSchema={toFormikValidationSchema(ProductSchema)}
        onSubmit={async (values: IProductSchema) => {
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

            <TextField
              name="price"
              type="number"
              label="Price"
              autoComplete="off"
            />

            <TextAreaField
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

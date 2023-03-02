import { Field, Form, Formik, FormikProps } from "formik";
import { useRouter } from "next/router";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { ICategorySchema, CategorySchema } from "../schema/category.schema";
import { api } from "../utils/api";
import { TextAreaField } from "./formik/TextAreaField";
import { TextField } from "./formik/TextField";

export const CreateCategory = () => {
  const utils = api.useContext();
  const router = useRouter();
  const mutation = api.category.add.useMutation({
    async onSuccess() {
      await utils.category.list.invalidate();
    },
  });
  return (
    <div className="">
			<h1 className="text-5xl text-bold">Create Category!</h1>
			<p className="text-xs mt-6 w-full text-center">Generate category such as motor, pump or sanitary lift station</p>
      <Formik<ICategorySchema>
        initialValues={{
          category: " ",
          description: " ",
        }}
        validationSchema={toFormikValidationSchema(CategorySchema)}
        onSubmit={async (values: ICategorySchema) => {
          mutation.mutate(values);
          router.push("/");
        }}
      >
        {(props: FormikProps<any>) => (
          <Form>
            <TextField
              name="category"
              type="text"
              label="Category"
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

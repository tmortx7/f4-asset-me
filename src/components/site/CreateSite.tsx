import { Field, Form, Formik, FormikProps } from "formik";
import { useRouter } from "next/router";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { ISiteSchema, SiteSchema } from "../../schema/site.schema";
import { api } from "../../utils/api";
import { TextAreaField } from "../formik/TextAreaField";
import { TextField } from "../formik/TextField";

export const CreateSite = () => {
  const utils = api.useContext();
  const router = useRouter();
  const mutation = api.site.add.useMutation({
    async onSuccess() {
      await utils.site.list.invalidate();
    },
  });
  const categoryQuery = api.category.list.useQuery();
  return (
    <div className="max-w-xs">
      <h1 className="text-bold text-5xl text-center">Create Site!</h1>
      <p className="mt-6 w-full text-center text-xs">
        Generate site locations for lift stations, river monitoring
      </p>
      <Formik<ISiteSchema>
        initialValues={{
          site: " ",
          alias: " ",
          note: " ",
          categoryId: " ",
        }}
        validationSchema={toFormikValidationSchema(SiteSchema)}
        onSubmit={async (values: ISiteSchema) => {
          mutation.mutate(values);
          router.push("/");
        }}
      >
        {(props: FormikProps<any>) => (
          <Form>
            <div className="flex flex-row gap-2">
              <TextField
                name="site"
                type="text"
                label="Site"
                autoComplete="off"
              />
              <div className="basis-1/4">
                <TextField
                  name="alias"
                  type="text"
                  label="Alias"
                  autoComplete="off"
                />
              </div>
            </div>
            <div className="form-control w-full">
              <label className="label">
                <p className="label-text">Category</p>
              </label>
              <Field
                className="select-bordered select w-full"
                as="select"
                name="categoryId"
                required
              >
                <option value="">(Select a category)</option>
                {categoryQuery.data?.map((catx: any) => (
                  <option value={catx.id}>{catx.category}</option>
                ))}
              </Field>
            </div>

            <TextAreaField
              name="note"
              type="text"
              label="Note"
              autoComplete="off"
            />
            <div className="flex flex-row gap-2">
              <button
                className="btn-outlined btn mt-4 justify-evenly "
                type="submit"
              >
                Add
              </button>
              <button
                className="btn-outlined btn mt-4"
                type="button"
                onClick={() => router.push("/")}
              >
                Cancel
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

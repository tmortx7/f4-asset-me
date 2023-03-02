import { Field, Form, Formik, FormikProps } from "formik";
import { useRouter } from "next/router";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { IAssetSchema, AssetSchema } from "../schema/asset.schema";
import { api } from "../utils/api";
import { TextAreaField } from "./formik/TextAreaField";
import { TextField } from "./formik/TextField";

export const CreateAsset = () => {
  const utils = api.useContext();
  const router = useRouter();
  const mutation = api.asset.add.useMutation({
    async onSuccess() {
      await utils.asset.list.invalidate();
    },
  });
  const siteQuery = api.site.list.useQuery();
  const catQuery = api.category.list.useQuery();
  const modelQuery = api.model.list.useQuery();
  return (
    <div className="">
      <h1 className="text-bold text-5xl">Create Asset!</h1>
      <p className="mt-6 w-full text-center text-xs">
        Generate asset for sites
      </p>
      <Formik<IAssetSchema>
        validateOnBlur={false}
        validateOnChange={true}
        initialValues={{
          description: "",
          note: " ",
          // siteId: "-",
          // categoryId: "-",
          // modelId: "-",
        }}
        validationSchema={toFormikValidationSchema(AssetSchema)}
        onSubmit={async (values: IAssetSchema) => {
          console.log(values)
          mutation.mutate(values);
          router.push("/");
        }}
      >
        {(props: FormikProps<any>) => (
          <Form>
            {/* <div className="form-control w-full">
              <label className="label">
                <p className="label-text">Site</p>
              </label>
              <Field
                className="select-bordered select w-full"
                as="select"
                name="siteId"
              >
                <option value=" ">(Select a site)</option>
                {siteQuery.data?.map((sitex: any) => (
                  <option value={sitex.id}>{sitex.site}</option>
                ))}
              </Field>
            </div> */}

            <TextField
              name="description"
              type="text"
              label="Description"
              autoComplete="off"
            />

            {/* <div className="form-control w-full">
              <label className="label">
                <p className="label-text">Model</p>
              </label>
              <Field
                className="select-bordered select w-full"
                as="select"
                name="modelId"
              >
                <option value=" ">(Select a model)</option>
                {modelQuery.data?.map((modelx: any) => (
                  <option value={modelx.id}>{modelx.model}</option>
                ))}
              </Field>
            </div>

            <div className="form-control w-full">
              <label className="label">
                <p className="label-text">Category</p>
              </label>
              <Field
                className="select-bordered select w-full"
                as="select"
                name="categoryId"
              >
                <option value=" ">(Select a category)</option>
                {catQuery.data?.map((catx: any) => (
                  <option value={catx.id}>{catx.category}</option>
                ))}
              </Field>
            </div> */}

            <TextAreaField name="note" label="Note" />

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

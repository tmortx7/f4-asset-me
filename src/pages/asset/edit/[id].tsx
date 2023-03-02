import { Field, Form, Formik, FormikProps } from "formik";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import NextError from "next/error";
import { useRouter } from "next/router";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { TextAreaField } from "../../../components/formik/TextAreaField";
import { TextField } from "../../../components/formik/TextField";
import {
  IEditAssetSchema,
  EditAssetSchema,
} from "../../../schema/asset.schema";

import { api } from "../../../utils/api";
import superjson from "superjson";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { appRouter } from "../../../server/api/root";
import { createInnerTRPCContext } from "../../../server/api/trpc";

const EditAssetPage = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const utils = api.useContext();
  const mutation = api.asset.edit.useMutation({
    async onSuccess() {
      await utils.asset.list.invalidate();
    },
  });

  const delMutation = api.asset.delete.useMutation({
    async onSuccess() {
      await utils.asset.list.invalidate();
      router.push("/");
    },
  });
  const router = useRouter();
  const id = useRouter().query.id as string;
  const assetQuery = api.asset.byId.useQuery({ id });

  if (assetQuery.error) {
    return (
      <NextError
        title={assetQuery.error.message}
        statusCode={assetQuery.error.data?.httpStatus ?? 500}
      />
    );
  }

  if (assetQuery.status !== "success") {
    return <>Loading...</>;
  }
  const siteQuery = api.site.list.useQuery();
  const catQuery = api.category.list.useQuery();
  const modelQuery = api.model.list.useQuery();
  return (
    <div className="flex flex-row justify-center">
      <div className="max-w- mt-6 rounded border-2 bg-slate-100 p-[20px]">
        <h1 className="text-bold text-5xl">Edit Asset!</h1>
        <p className="mt-6 w-full text-center text-xs">
          Generate assets for locations
        </p>
        <Formik<IEditAssetSchema>
          initialValues={{
            id: assetQuery.data?.id,
            description: assetQuery.data?.description ,
            note: assetQuery.data?.note!,
            siteId: assetQuery.data?.siteId! ,
            // categoryId: assetQuery.data?.categoryId,
            // modelId: assetQuery.data?.modelId,
          }}
          validationSchema={toFormikValidationSchema(EditAssetSchema)}
          onSubmit={async (values: IEditAssetSchema) => {
            mutation.mutate(values);
            router.push("/");
          }}
        >
          {(props: FormikProps<any>) => (
            <Form>
              <div className="form-control w-full">
                <label className="label">
                  <p className="label-text">Site</p>
                </label>
                <Field
                  className="select-bordered select w-full"
                  as="select"
                  name="siteId"
                >
                  <option value="">(Select a site)</option>
                  {siteQuery.data?.map((sitex, index):any=> (
                    <option key={index} value={sitex.id}>{sitex.site}</option>
                  ))}
                </Field>
              </div>

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
                  <option value="">(Select a model)</option>
                  {modelQuery.data?.map((modelx,index):any => (
                    <option key={index} value={modelx.id}>{modelx.model}</option>
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
                  <option value="">(Select a category)</option>
                  {catQuery.data?.map((catx,index):any => (
                    <option key={index} value={catx.id}>{catx.category}</option>
                  ))}
                </Field>
              </div> */}

              <TextAreaField name="note" label="Note" />

              <div className="flex flex-row gap-2">
                <button
                  className="btn-outlined btn mt-4 justify-evenly "
                  type="submit"
                >
                  Edit
                </button>
                <button
                  className="btn-outlined btn mt-4"
                  onClick={() => router.push("/")}
                  type="button"
                >
                  Cancel
                </button>
                <button
                  className="btn-outline btn mt-4"
                  onClick={() => delMutation.mutate({ id })}
                  type="button"
                >
                  Delete
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export async function getServerSideProps(
  context: GetServerSidePropsContext<{ id: string }>
) {
  const ssg = createProxySSGHelpers({
    router: appRouter,
    ctx: createInnerTRPCContext(),
    transformer: superjson,
  });
  const id = context.params?.id as string;
  // Prefetch `post.byId`
  await ssg.asset.byId.fetch({ id });
  // Make sure to return { props: { trpcState: ssg.dehydrate() } }
  return {
    props: {
      trpcState: ssg.dehydrate(),
      id,
    },
  };
}

export default EditAssetPage;

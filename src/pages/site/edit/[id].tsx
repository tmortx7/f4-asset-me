import { Field, Form, Formik, FormikProps } from "formik";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import { useRouter } from "next/router";
import NextError from "next/error";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { TextAreaField } from "../../../components/formik/TextAreaField";
import { TextField } from "../../../components/formik/TextField";
import { IEditSiteSchema, EditSiteSchema } from "../../../schema/site.schema";
import { api } from "../../../utils/api";
import superjson from "superjson";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { appRouter } from "../../../server/api/root";
import { createInnerTRPCContext } from "../../../server/api/trpc";

const EditSitePage = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const utils = api.useContext();
  const mutation = api.site.edit.useMutation({
    async onSuccess() {
      await utils.site.list.invalidate();
      router.push("/");
    },
  });
  const router = useRouter();
  const delMutation = api.site.delete.useMutation({
    async onSuccess() {
      await utils.site.list.invalidate();
    },
  });
  const id = useRouter().query.id as string;
  const siteQuery = api.site.byId.useQuery({ id });

  if (siteQuery.error) {
    return (
      <NextError
        title={siteQuery.error.message}
        statusCode={siteQuery.error.data?.httpStatus ?? 500}
      />
    );
  }

  if (siteQuery.status !== "success") {
    return <>Loading...</>;
  }
  const categoryQuery = api.category.list.useQuery();
  return (
    <div className="flex flex-row justify-center">
      <div className="max-w- mt-6 rounded border-2 bg-slate-100 p-[20px]">
        <h1 className="text-bold text-5xl">Edit Site!</h1>
        <p className="mt-6 w-full text-center text-xs">
          Generate site locations for lift stations, river monitoring
        </p>
        <Formik<IEditSiteSchema>
          initialValues={{
            id: siteQuery.data.id,
            site: siteQuery.data?.site,
            alias: siteQuery.data?.alias,
            note: siteQuery.data?.note,
            categoryId: siteQuery.data?.categoryId!,
          }}
          validationSchema={toFormikValidationSchema(EditSiteSchema)}
          onSubmit={async (values: IEditSiteSchema) => {
            mutation.mutate(values);
            router.push("/");
          }}
        >
          {(props: FormikProps<any>) => (
            <Form>
              <TextField
                name="site"
                type="text"
                label="Site"
                autoComplete="off"
              />
              <TextField
                name="alias"
                type="text"
                label="Alias"
                autoComplete="off"
              />

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
                label="note"
                autoComplete="off"
              />
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
  await ssg.site.byId.fetch({ id });
  // Make sure to return { props: { trpcState: ssg.dehydrate() } }
  return {
    props: {
      trpcState: ssg.dehydrate(),
      id,
    },
  };
}

export default EditSitePage;

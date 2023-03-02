import { Form, Formik, FormikProps } from "formik";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import { useRouter } from "next/router";
import NextError from "next/error";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { TextAreaField } from "../../../components/formik/TextAreaField";
import { TextField } from "../../../components/formik/TextField";
import {
  IEditCategorySchema,
  EditCategorySchema,
} from "../../../schema/category.schema";
import { api } from "../../../utils/api";
import superjson from "superjson";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { appRouter } from "../../../server/api/root";
import { createInnerTRPCContext } from "../../../server/api/trpc";

const EditCategoryPage = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const utils = api.useContext();
  const mutation = api.category.edit.useMutation({
    async onSuccess() {
      await utils.category.list.invalidate();
    },
  });

  const delMutation = api.category.delete.useMutation({
    async onSuccess() {
      await utils.category.list.invalidate();
      router.push("/")
    },
  });
  const router = useRouter();
  const id = useRouter().query.id as string;
  const categoryQuery = api.category.byId.useQuery({ id });

  if (categoryQuery.error) {
    return (
      <NextError
        title={categoryQuery.error.message}
        statusCode={categoryQuery.error.data?.httpStatus ?? 500}
      />
    );
  }

  if (categoryQuery.status !== "success") {
    return <>Loading...</>;
  }

  return (
    <div className="flex flex-row justify-center">
      <div className="max-w- mt-6 rounded border-2 bg-slate-100 p-[20px]">
        <h1 className="text-bold text-5xl">Edit Category!</h1>
        <p className="mt-6 w-full text-center text-xs">
          Generate category locations for lift stations, river monitoring
        </p>
        <Formik<IEditCategorySchema>
          initialValues={{
            id: categoryQuery.data.id,
            category: categoryQuery.data?.category,
            description: categoryQuery.data?.description,
          }}
          validationSchema={toFormikValidationSchema(EditCategorySchema)}
          onSubmit={async (values: IEditCategorySchema) => {
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
  await ssg.category.byId.fetch({ id });
  // Make sure to return { props: { trpcState: ssg.dehydrate() } }
  return {
    props: {
      trpcState: ssg.dehydrate(),
      id,
    },
  };
}

export default EditCategoryPage;

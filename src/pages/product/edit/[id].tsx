import { Form, Formik, FormikProps } from "formik";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import { useRouter } from "next/router";
import NextError from "next/error";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { TextAreaField } from "../../../components/formik/TextAreaField";
import { TextField } from "../../../components/formik/TextField";
import {
  IEditProductSchema,
  EditProductSchema,
} from "../../../schema/product.schema";
import { api } from "../../../utils/api";
import superjson from "superjson";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { appRouter } from "../../../server/api/root";
import { createInnerTRPCContext } from "../../../server/api/trpc";

const EditProductPage = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const utils = api.useContext();
  const mutation = api.product.edit.useMutation({
    async onSuccess() {
      await utils.product.list.invalidate();
    },
  });

  const delMutation = api.product.delete.useMutation({
    async onSuccess() {
      await utils.product.list.invalidate();
      router.push("/")
    },
  });
  const router = useRouter();
  const id = useRouter().query.id as string;
  const productQuery = api.product.byId.useQuery({ id });

  if (productQuery.error) {
    return (
      <NextError
        title={productQuery.error.message}
        statusCode={productQuery.error.data?.httpStatus ?? 500}
      />
    );
  }

  if (productQuery.status !== "success") {
    return <>Loading...</>;
  }

  return (
    <div className="flex flex-row justify-center">
      <div className="max-w- mt-6 rounded border-2 bg-slate-100 p-[20px]">
        <h1 className="text-bold text-5xl">Edit Product!</h1>
        <p className="mt-6 w-full text-center text-xs">
          Generate products used in the field
        </p>
        <Formik<IEditProductSchema>
          initialValues={{
            id: productQuery.data.id,
            name: productQuery.data?.name,
            price: productQuery.data?.price,
            description: productQuery.data?.description!,
          }}
          validationSchema={toFormikValidationSchema(EditProductSchema)}
          onSubmit={async (values: IEditProductSchema) => {
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
  await ssg.product.byId.fetch({ id });
  // Make sure to return { props: { trpcState: ssg.dehydrate() } }
  return {
    props: {
      trpcState: ssg.dehydrate(),
      id,
    },
  };
}

export default EditProductPage;

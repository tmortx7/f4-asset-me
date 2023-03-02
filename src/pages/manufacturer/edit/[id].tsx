import { Form, Formik, FormikProps } from "formik";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import { useRouter } from "next/router";
import NextError from "next/error";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { TextAreaField } from "../../../components/formik/TextAreaField";
import { TextField } from "../../../components/formik/TextField";
import {
  IEditManufacturerSchema,
  EditManufacturerSchema,
} from "../../../schema/manufacturer.schema";
import { api } from "../../../utils/api";
import superjson from "superjson";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { appRouter } from "../../../server/api/root";
import { createInnerTRPCContext } from "../../../server/api/trpc";

const EditManufacturerPage = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const utils = api.useContext();
  const mutation = api.manufacturer.edit.useMutation({
    async onSuccess() {
      await utils.manufacturer.list.invalidate();
    },
  });

  const delMutation = api.manufacturer.delete.useMutation({
    async onSuccess() {
      await utils.manufacturer.list.invalidate();
      router.push("/")
    },
  });
  const router = useRouter();
  const id = useRouter().query.id as string;
  const manufacturerQuery = api.manufacturer.byId.useQuery({ id });

  if (manufacturerQuery.error) {
    return (
      <NextError
        title={manufacturerQuery.error.message}
        statusCode={manufacturerQuery.error.data?.httpStatus ?? 500}
      />
    );
  }

  if (manufacturerQuery.status !== "success") {
    return <>Loading...</>;
  }

  return (
    <div className="flex flex-row justify-center">
      <div className="max-w- mt-6 rounded border-2 bg-slate-100 p-[20px]">
        <h1 className="text-bold text-5xl">Edit Manufacturer!</h1>
        <p className="mt-6 w-full text-center text-xs">
          Generate manufacturer information
        </p>
        <Formik<IEditManufacturerSchema>
          initialValues={{
            id: manufacturerQuery.data.id,
            name: manufacturerQuery.data?.name,
            note: manufacturerQuery.data?.note!,
          }}
          validationSchema={toFormikValidationSchema(EditManufacturerSchema)}
          onSubmit={async (values: IEditManufacturerSchema) => {
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
  await ssg.manufacturer.byId.fetch({ id });
  // Make sure to return { props: { trpcState: ssg.dehydrate() } }
  return {
    props: {
      trpcState: ssg.dehydrate(),
      id,
    },
  };
}

export default EditManufacturerPage;

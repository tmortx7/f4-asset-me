import { Form, Formik, FormikProps } from "formik";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import { useRouter } from "next/router";
import NextError from "next/error";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { TextAreaField } from "../../../components/formik/TextAreaField";
import { TextField } from "../../../components/formik/TextField";
import {
  IEditInstrumentFunctionSchema,
  EditInstrumentFunctionSchema,
} from "../../../schema/instrumentfunction.schema";
import { api } from "../../../utils/api";
import superjson from "superjson";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { appRouter } from "../../../server/api/root";
import { createInnerTRPCContext } from "../../../server/api/trpc";

const EditInstrumentFunctionPage = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const utils = api.useContext();
  const mutation = api.instrumentfunction.edit.useMutation({
    async onSuccess() {
      await utils.instrumentfunction.list.invalidate();
    },
  });

  const delMutation = api.instrumentfunction.delete.useMutation({
    async onSuccess() {
      await utils.instrumentfunction.list.invalidate();
      router.push("/")
    },
  });
  const router = useRouter();
  const id = useRouter().query.id as string;
  const instrumentfunctionQuery = api.instrumentfunction.byId.useQuery({ id });

  if (instrumentfunctionQuery.error) {
    return (
      <NextError
        title={instrumentfunctionQuery.error.message}
        statusCode={instrumentfunctionQuery.error.data?.httpStatus ?? 500}
      />
    );
  }

  if (instrumentfunctionQuery.status !== "success") {
    return <>Loading...</>;
  }

  return (
    <div className="flex flex-row justify-center">
      <div className="max-w- mt-6 rounded border-2 bg-slate-100 p-[20px]">
        <h1 className="text-bold text-5xl">Edit Instrument Function!</h1>
        <p className="mt-6 w-full text-center text-xs">
          Generate instrument functions such as alarm, transmitter and gauge
        </p>
        <Formik<IEditInstrumentFunctionSchema>
          initialValues={{
            id: instrumentfunctionQuery.data.id,
            functionx: instrumentfunctionQuery.data?.functionx,
            alias: instrumentfunctionQuery.data?.alias,
          }}
          validationSchema={toFormikValidationSchema(EditInstrumentFunctionSchema)}
          onSubmit={async (values: IEditInstrumentFunctionSchema) => {
            mutation.mutate(values);
            router.push("/");
          }}
        >
          {(props: FormikProps<any>) => (
            <Form>
              <TextField
                name="functionx"
                type="text"
                label="Function"
                autoComplete="off"
              />
              <TextField
                name="alias"
                type="text"
                label="Alias"
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
  await ssg.instrumentfunction.byId.fetch({ id });
  // Make sure to return { props: { trpcState: ssg.dehydrate() } }
  return {
    props: {
      trpcState: ssg.dehydrate(),
      id,
    },
  };
}

export default EditInstrumentFunctionPage;

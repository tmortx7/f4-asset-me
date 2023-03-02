import { Form, Formik, FormikProps } from "formik";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import { useRouter } from "next/router";
import NextError from "next/error";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { TextField } from "../../../components/formik/TextField";
import {
  IEditMeasuredVariableSchema,
  IMeasuredVariableSchema,
  MeasuredVariableSchema,
} from "../../../schema/measuredvariable.schema";
import { api } from "../../../utils/api";
import superjson from "superjson";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { appRouter } from "../../../server/api/root";

const MeasuredVariablePage = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const utils = api.useContext();
  const mutation = api.measuredvariable.edit.useMutation({
    async onSuccess() {
      await utils.measuredvariable.list.invalidate();
    },
  });

  const delMutation = api.measuredvariable.delete.useMutation({
    async onSuccess() {
      await utils.measuredvariable.list.invalidate();
      router.push("/")
    },
  });
  const router = useRouter();
  const id = useRouter().query.id as string;
  const measuredvariableQuery = api.measuredvariable.byId.useQuery({ id });

  if (measuredvariableQuery.error) {
    return (
      <NextError
        title={measuredvariableQuery.error.message}
        statusCode={measuredvariableQuery.error.data?.httpStatus ?? 500}
      />
    );
  }

  if (measuredvariableQuery.status !== "success") {
    return <>Loading...</>;
  }

  return (
    <div className="flex flex-row justify-center">
      <div className="max-w- mt-6 rounded border-2 bg-slate-100 p-[20px]">
        <h1 className="text-bold text-5xl">Edit Measured Variable!</h1>
        <p className="mt-6 w-full text-center text-xs">
          Generate measured variables such as flow, temperature
        </p>
        <Formik<IEditMeasuredVariableSchema>
          initialValues={{
            id: measuredvariableQuery.data.id,
            variablex: measuredvariableQuery.data?.variablex,
            alias: measuredvariableQuery.data?.alias,
          }}
          validationSchema={toFormikValidationSchema(MeasuredVariableSchema)}
          onSubmit={async (values: IEditMeasuredVariableSchema) => {
            mutation.mutate(values);
            router.push("/");
          }}
        >
          {(props: FormikProps<any>) => (
            <Form>
              <TextField
                name="variablex"
                type="text"
                label="Variable"
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
  await ssg.measuredvariable.byId.fetch({ id });
  // Make sure to return { props: { trpcState: ssg.dehydrate() } }
  return {
    props: {
      trpcState: ssg.dehydrate(),
      id,
    },
  };
}

export default MeasuredVariablePage;

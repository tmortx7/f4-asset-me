import { Field, Form, Formik, FormikProps } from "formik";
import { useRouter } from "next/router";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import { toFormikValidationSchema } from "zod-formik-adapter";
import {
  EditInstrumentTypeSchema,
  IEditInstrumentTypeSchema,
  IInstrumentTypeSchema,
} from "../../../schema/instrumenttype.schema";
import { api } from "../../../utils/api";
import superjson from "superjson";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { appRouter } from "../../../server/api/root";
import { createInnerTRPCContext } from "../../../server/api/trpc";
import NextError from "next/error";
import { TextField } from "../../../components/formik/TextField";

const EditInstrumentTypePage = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const utils = api.useContext();
  const router = useRouter();
  const id = useRouter().query.id as string;
  const typeQuery = api.instrumenttype.byId.useQuery({ id });

  if (typeQuery.error) {
    return (
      <NextError
        title={typeQuery.error.message}
        statusCode={typeQuery.error.data?.httpStatus ?? 500}
      />
    );
  }

  if (typeQuery.status !== "success") {
    return <>Loading...</>;
  }
  const mutation = api.instrumenttype.add.useMutation({
    async onSuccess() {
      await utils.instrumenttype.list.invalidate();
    },
  });

  const delMutation = api.instrumenttype.delete.useMutation({
    async onSuccess() {
      await utils.instrumenttype.list.invalidate();
      router.push("/")
    },
  });
  const mvQuery = api.measuredvariable.list.useQuery();
  const instQuery = api.instrumentfunction.list.useQuery();
  return (
    <div className="flex flex-row justify-center">
      <div className="max-w- mt-6 rounded border-2 bg-slate-100 p-[20px]">
        <h1 className="text-bold text-5xl">Edit Instrument Type!</h1>
        <p className="mt-6 w-full text-center text-xs">
          Generate types such as FA flow alarm
        </p>
        <Formik<IEditInstrumentTypeSchema>
          initialValues={{
            id: typeQuery.data?.id,
            type: typeQuery.data?.type,
            mvId: typeQuery.data?.mvId,
            instfunctionId: typeQuery.data?.instfunctionId,
            description: typeQuery.data?.description,
          }}
          validationSchema={toFormikValidationSchema(EditInstrumentTypeSchema)}
          onSubmit={async (values: IInstrumentTypeSchema) => {
            mutation.mutate(values);
            router.push("/");
          }}
        >
          {(props: FormikProps<any>) => (
            <Form>
              <div className="form-control w-full">
                <label className="label">
                  <p className="label-text">Measured Variable</p>
                </label>
                <Field
                  className="select-bordered select w-full"
                  as="select"
                  name="mvId"
                  required
                >
                  <option value="">(Select a variable)</option>
                  {mvQuery.data?.map((mvx: any) => (
                    <option value={mvx.id}>{mvx.variablex}</option>
                  ))}
                </Field>
              </div>

              <div className="form-control w-full">
                <label className="label">
                  <p className="label-text">Instrument Type</p>
                </label>
                <Field
                  className="select-bordered select w-full"
                  as="select"
                  name="instfunctionId"
                  required
                >
                  <option value="">(Select a inst function)</option>
                  {instQuery.data?.map((instx: any) => (
                    <option value={instx.id}>{instx.functionx}</option>
                  ))}
                </Field>
              </div>
              <TextField
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
  await ssg.instrumenttype.byId.fetch({ id });
  // Make sure to return { props: { trpcState: ssg.dehydrate() } }
  return {
    props: {
      trpcState: ssg.dehydrate(),
      id,
    },
  };
}
export default EditInstrumentTypePage;

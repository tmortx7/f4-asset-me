import { Field, Form, Formik, FormikProps } from "formik";
import { useRouter } from "next/router";
import { toFormikValidationSchema } from "zod-formik-adapter";
import {
  IEditModelSchema,
  EditModelSchema,
} from "../../../schema/model.schema";
import { api } from "../../../utils/api";
import NextError from "next/error";
import superjson from "superjson";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { appRouter } from "../../../server/api/root";
import { createInnerTRPCContext } from "../../../server/api/trpc";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import { TextField } from "../../../components/formik/TextField";
import { TextAreaField } from "../../../components/formik/TextAreaField";

const EditModelPage = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const utils = api.useContext();
  const mutation = api.model.edit.useMutation({
    async onSuccess() {
      await utils.model.list.invalidate();
    },
  });
  const router = useRouter();
  const delMutation = api.model.delete.useMutation({
    async onSuccess() {
      await utils.model.list.invalidate();
    },
  });
  const id = useRouter().query.id as string;
  const modelQuery = api.model.byId.useQuery({ id });

  if (modelQuery.error) {
    return (
      <NextError
        title={modelQuery.error.message}
        statusCode={modelQuery.error.data?.httpStatus ?? 500}
      />
    );
  }

  if (modelQuery.status !== "success") {
    return <>Loading...</>;
  }
  const manQuery = api.manufacturer.list.useQuery();
  return (
    <div className="flex flex-row justify-center">
      <div className="max-w- mt-6 rounded border-2 bg-slate-100 p-[20px]">
        <h1 className="text-bold text-5xl">Edit Manufacturer!</h1>
        <p className="mt-6 w-full text-center text-xs">
          Generate manufacturer information
        </p>
        <Formik<IEditModelSchema>
          initialValues={{
            id: modelQuery.data.id,
            model: modelQuery.data?.model!,
            serialno: modelQuery.data?.serialno!,
            note: modelQuery.data?.note!,
            manufacturerId: modelQuery?.data.manufacturerId!,
          }}
          validationSchema={toFormikValidationSchema(EditModelSchema)}
          onSubmit={async (values: IEditModelSchema) => {
            mutation.mutate(values);
            router.push("/");
          }}
        >
          {(props: FormikProps<any>) => (
            <Form>
              <div className="form-control w-full">
                <label className="label">
                  <p className="label-text">Manfacturer</p>
                </label>
                <Field
                  className="select-bordered select w-full"
                  as="select"
                  name="manufacturerId"
                  required
                >
                  <option value="">(Select a manufacturer)</option>
                  {manQuery.data?.map((manx: any) => (
                    <option value={manx.id}>{manx.name}</option>
                  ))}
                </Field>
              </div>
              <TextField
                name="model"
                type="text"
                label="Model"
                autoComplete="off"
              />
              <TextField
                name="serialno"
                type="text"
                label="Serial Number"
                autoComplete="off"
              />
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
  await ssg.model.byId.fetch({ id });
  // Make sure to return { props: { trpcState: ssg.dehydrate() } }
  return {
    props: {
      trpcState: ssg.dehydrate(),
      id,
    },
  };
}

export default EditModelPage;

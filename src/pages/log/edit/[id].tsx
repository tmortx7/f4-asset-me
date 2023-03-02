import { Field, Form, Formik, FormikProps } from "formik";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import { useRouter } from "next/router";
import NextError from "next/error";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { TextAreaField } from "../../../components/formik/TextAreaField";
import {
  IEditLogSchema,
  EditLogSchema,
} from "../../../schema/log.schema";
import { api } from "../../../utils/api";
import superjson from "superjson";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { appRouter } from "../../../server/api/root";
import { createInnerTRPCContext } from "../../../server/api/trpc";

const EditLogPage = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const utils = api.useContext();
  const mutation = api.log.edit.useMutation({
    async onSuccess() {
      await utils.log.list.invalidate();
    },
  });

  const delMutation = api.log.delete.useMutation({
    async onSuccess() {
      console.log("delete")
      await utils.log.list.invalidate();
      router.push("/")
    },
  });
  const router = useRouter();
  const id = useRouter().query.id as string;
  const logQuery = api.log.byId.useQuery({ id });

  if (logQuery.error) {
    return (
      <NextError
        title={logQuery.error.message}
        statusCode={logQuery.error.data?.httpStatus ?? 500}
      />
    );
  }

  if (logQuery.status !== "success") {
    return <>Loading...</>;
  }

  const siteQuery = api.site.list.useQuery();


  return (
    <div className="flex flex-row justify-center">
      <div className="max-w- mt-6 rounded border-2 bg-slate-100 p-[20px]">
        <h1 className="text-bold text-5xl">Edit Log!</h1>
        <p className="mt-6 w-full text-center text-xs">
          Generate log locations for lift stations, river monitoring
        </p>
        <Formik<IEditLogSchema>
          initialValues={{
            id: logQuery.data.id,
            log: logQuery.data?.log,
            siteId: logQuery.data?.siteId,
          }}
          validationSchema={toFormikValidationSchema(EditLogSchema)}
          onSubmit={async (values: IEditLogSchema) => {
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
                required
              >
                <option value="">(Select a site)</option>
                {siteQuery.data?.map((sitex: any) => (
                  <option value={sitex.id}>{sitex.site}</option>
                ))}
              </Field>
            </div>
              <TextAreaField
                name="log"
                label="Log"
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
  await ssg.log.byId.fetch({ id });
  // Make sure to return { props: { trpcState: ssg.dehydrate() } }
  return {
    props: {
      trpcState: ssg.dehydrate(),
      id,
    },
  };
}

export default EditLogPage;

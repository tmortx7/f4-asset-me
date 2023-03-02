import { Field, Form, Formik, FormikProps } from "formik";
import router, { useRouter } from "next/router";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { TextField } from "../../../components/formik/TextField";
import { EditLoopSchema, IEditLoopSchema } from "../../../schema/loop.schema";
import { api } from "../../../utils/api";
import superjson from "superjson";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { appRouter } from "../../../server/api/root";
import { createInnerTRPCContext } from "../../../server/api/trpc";
import NextError from "next/error";

export const EditLoopPage = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const utils = api.useContext();
  const mutation = api.loop.edit.useMutation({
    async onSuccess() {
      await utils.loop.list.invalidate();
    },
  });

  const delMutation = api.loop.delete.useMutation({
    async onSuccess() {
      await utils.loop.list.invalidate();
      router.push("/");
    },
  });

  const router = useRouter();
  const id = useRouter().query.id as string;
  const loopQuery = api.loop.byId.useQuery({ id });

  if (loopQuery.error) {
    return (
      <NextError
        title={loopQuery.error.message}
        statusCode={loopQuery.error.data?.httpStatus ?? 500}
      />
    );
  }

  if (loopQuery.status !== "success") {
    return <>Loading...</>;
  }
  const mvQuery = api.measuredvariable.list.useQuery();
  const siteQuery = api.site.list.useQuery();
  return (
    <div className="flex flex-row justify-center">
      <div className="max-w- mt-6 rounded border-2 bg-slate-100 p-[20px]">
        <h1 className="text-bold text-5xl">Edit Loop!</h1>
        <p className="mt-6 w-full text-center text-xs">
          Generate instrument loop
        </p>
        <Formik<IEditLoopSchema>
          initialValues={{
            id: loopQuery.data.id,
            numberic: loopQuery.data.numberic,
            mvId: loopQuery.data.mvId,
            siteId: loopQuery.data.siteId,
            service: loopQuery.data.service,
            loop: loopQuery.data.loop,
          }}
          validationSchema={toFormikValidationSchema(EditLoopSchema)}
          onSubmit={async (values: IEditLoopSchema) => {
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
                  disabled
                >
                  <option value="">(Select a site)</option>
                  {siteQuery.data?.map((sitex: any) => (
                    <option value={sitex.id}>{sitex.site}</option>
                  ))}
                </Field>
              </div>

              <div className="form-control w-full">
                <label className="label">
                  <p className="label-text">Variable</p>
                </label>
                <Field
                  className="select-bordered select w-full"
                  as="select"
                  name="mvId"
                  disabled
                >
                  <option value="">(Select a variable)</option>
                  {mvQuery.data?.map((mvx: any) => (
                    <option value={mvx.id}>{mvx.variablex}</option>
                  ))}
                </Field>
              </div>
              <TextField
                name="numberic"
                type="number"
                label="Numberic"
                autoComplete="off"
              />
              <TextField
                name="service"
                type="text"
                label="Service"
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
  await ssg.loop.byId.fetch({ id });
  // Make sure to return { props: { trpcState: ssg.dehydrate() } }
  return {
    props: {
      trpcState: ssg.dehydrate(),
      id,
    },
  };
}
export default EditLoopPage;

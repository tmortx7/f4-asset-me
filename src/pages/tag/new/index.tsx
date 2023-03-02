import { Field, Form, Formik, FormikProps } from "formik";
import { useRouter } from "next/router";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { TextAreaField } from "../../../components/formik/TextAreaField";
import { TextField } from "../../../components/formik/TextField";
import { ILoopTagSchema, LoopTagSchema } from "../../../schema/looptag.schema";
import { api } from "../../../utils/api";

const CreateLoopTag = () => {
  const utils = api.useContext();
  const router = useRouter();
  const mutation = api.looptag.add.useMutation({
    async onSuccess() {
      await utils.looptag.list.invalidate();
    },
  });
  const loopQuery = api.loop.list.useQuery();
  const typeQuery = api.instrumenttype.list.useQuery();
  return (
    <div className="flex flex-row justify-center">
      <div className="max-w- mt-6 rounded border-2 bg-slate-100 p-[20px]">
        <h1 className="text-bold text-5xl">Create Instrument Tag!</h1>
        <p className="mt-6 w-full text-center text-xs">
          Generate instrument tag
        </p>
        <Formik<ILoopTagSchema>
          initialValues={{
            tag: " ",
            loopId: " ",
            typeId: " ",
            order: 0,
            note: " ",
          }}
          validationSchema={toFormikValidationSchema(LoopTagSchema)}
          onSubmit={async (values: ILoopTagSchema) => {
            mutation.mutate(values);
            router.push("/");
          }}
        >
          {(props: FormikProps<any>) => (
            <Form>
              <div className="form-control w-full">
                <label className="label">
                  <p className="label-text">Loop</p>
                </label>
                <Field
                  className="select-bordered select w-full"
                  as="select"
                  name="loopId"
                >
                  <option value="">(Select a loop)</option>
                  {loopQuery.data?.map((loopx: any) => (
                    <option value={loopx.id}>{loopx.loop}</option>
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
                  name="typeId"
                  required
                >
                  <option value="">(Select a instrument type)</option>
                  {typeQuery.data?.map((mvx: any) => (
                    <option value={mvx.id}>{mvx.description} - {mvx.type}</option>
                  ))}
                </Field>
              </div>
              <TextField
                name="order"
                type="number"
                label="Order"
                autoComplete="off"
              />
              <TextAreaField name="note" label="Note" autoComplete="off" />

              <div className="flex flex-row gap-2">
                <button
                  className="btn-outlined btn mt-4 justify-evenly "
                  type="submit"
                >
                  Add
                </button>
                <button
                  className="btn-outlined btn mt-4"
                  type="button"
                  onClick={() => router.push("/")}
                >
                  Cancel
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default CreateLoopTag;

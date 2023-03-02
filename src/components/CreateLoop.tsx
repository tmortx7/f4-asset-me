import { Field, Form, Formik, FormikProps } from "formik";
import { useRouter } from "next/router";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { ILoopSchema, LoopSchema } from "../schema/loop.schema";
import { api } from "../utils/api";
import { TextField } from "./formik/TextField";

export const CreateLoop = () => {
  const utils = api.useContext();
  const router = useRouter();
  const mutation = api.loop.add.useMutation({
    async onSuccess() {
      await utils.loop.list.invalidate();
    },
  });
  const mvQuery = api.measuredvariable.list.useQuery();
  const siteQuery = api.site.list.useQuery();
  return (
    <div className="">
      <h1 className="text-bold text-5xl">Create Loop!</h1>
      <p className="mt-6 w-full text-center text-xs">
        Generate instrument loop
      </p>
      <Formik<ILoopSchema>
        initialValues={{
          numberic: 100,
          mvId: "",
          siteId: "",
          service: " ",
          loop: " ",
        }}
        validationSchema={toFormikValidationSchema(LoopSchema)}
        onSubmit={async (values: ILoopSchema) => {
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

            <div className="form-control w-full">
              <label className="label">
                <p className="label-text">Variable</p>
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
  );
};

import { Field, Form, Formik, FormikProps } from "formik";
import { useRouter } from "next/router";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { ILogSchema, LogSchema } from "../schema/log.schema";
import { api } from "../utils/api";
import { TextAreaField } from "./formik/TextAreaField";

export const CreateLog = () => {
  const utils = api.useContext();
  const router = useRouter();
  const mutation = api.log.add.useMutation({
     async onSuccess() {
      await utils.log.list.invalidate();
    },
  });
  const siteQuery = api.site.list.useQuery();
  return (
    <div className="">
			<h1 className="text-5xl text-bold">Create Log!</h1>
			<p className="text-xs mt-6 w-full text-center">Generate logs for sites</p>
      <Formik<ILogSchema>
        initialValues={{
          log: " ",
          siteId: "",
        }}
        validationSchema={toFormikValidationSchema(LogSchema)}
        onSubmit={async (values: ILogSchema) => {
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
              <button className="btn-outlined btn mt-4 justify-evenly " type="submit">
                Add
              </button>
							<button className="btn btn-outlined mt-4" type="button" onClick={()=>router.push("/")}>
								Cancel
							</button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

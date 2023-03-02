import { Form, Formik, FormikProps } from "formik";
import router from "next/router";
import { TextField } from "../components/formik/TextField";

const PumpPage = () => {
  return (
		<div className="flex flex-row justify-center">
		<div className="max-w- mt-6 rounded border-2 bg-slate-100 p-[20px]">
			<h1 className="text-bold text-5xl">Tag List</h1>
			<p className="mt-6 w-full text-center text-xs">
				Generate tag list
			</p>
        <Formik
          initialValues={{
            site: "",
          }}
          onSubmit={async (values) => {}}
        >
          {(props: FormikProps<any>) => (
            <Form>
              <TextField
                name="site"
                type="text"
                label="Site"
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
    </div>
  );
};

export default PumpPage;

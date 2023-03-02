import { Field, Form, Formik, FormikProps } from "formik";
import { useRouter } from "next/router";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { ITodoListSchema, TodoListSchema } from "../schema/todolist.schema";
import { api } from "../utils/api";
import { TextField } from "./formik/TextField";

export const CreateTodoList = () => {
  const utils = api.useContext();
  const router = useRouter();
  const mutation = api.todolist.add.useMutation({
    async onSuccess() {
      await utils.todolist.list.invalidate();
    },
  });
  return (
    <div className="">
			<h1 className="text-5xl text-bold">Create TodoList!</h1>
			<p className="text-xs mt-6 w-full text-center">Generate list of todo's</p>
      <Formik<ITodoListSchema>
        initialValues={{
          title: " ",
        }}
        validationSchema={toFormikValidationSchema(TodoListSchema)}
        onSubmit={async (values: ITodoListSchema) => {
          mutation.mutate(values);
          router.push(`/todo/edit/${values.title}`)
        }}
      >
        {(props: FormikProps<any>) => (
          <Form>
            <TextField
              name="title"
              type="text"
              label="Title"
              autoComplete="off"
            />


            <div className="flex flex-row gap-2">
              <button className="btn-outlined btn mt-4" type="submit">
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

import React from "react";
import { useForm, FieldError } from "react-hook-form";
import { toast } from "react-toastify";
import type { Question } from "./FormBuilder";

const FormTester: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = (data: { [key: string]: string }) => {
    console.log(data);
    toast("Form submitted successfully!", { className: "my-toast" });
  };

  const formFromLocalStorage = localStorage.getItem("form");
  const form = formFromLocalStorage ? JSON.parse(formFromLocalStorage) : null;

  if (!form || form.questions.length === 0) {
    return <h1 className="mt-16 lg:mt-0">No form data found!</h1>;
  }

  return (
    <div>
      <h1 className="text-8xl my-16">Form Tester</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        {form.questions.map((question: Question, idx: number) => (
          <div
            className={`${
              question.type === "True/False" && "flex items-center mb-6"
            }`}
            key={idx}
          >
            <label className="text-2xl mr-4">
              {question.text ? (
                question.text
              ) : (
                <span className="text-red-500">
                  "Oops, you forgot to write the question text!"
                </span>
              )}
            </label>
            {question.type === "Text" && (
              <div className="mb-6">
                <input
                  className="p-4 w-full lg:w-3/5 rounded-l-lg bg-gray-800 mt-6 text-2xl"
                  {...register(`question_${question.id}`, {
                    validate: (value) => {
                      const validation = question.validation;
                      for (const v of validation) {
                        if (
                          v.type === "StartsWith" &&
                          !value.startsWith(v.value)
                        )
                          return `Must start with "${v.value}"`;
                        if (v.type === "Contains" && !value.includes(v.value))
                          return `Must contain "${v.value}"`;

                        if (v.type === "Required" && !value)
                          return "Field is required";
                      }
                    },
                  })}
                />
                {errors[`question_${question.id}`] && (
                  <p className="text-red-500 text-xl mt-2">
                    {(errors[`question_${question.id}`] as FieldError).message}
                  </p>
                )}
              </div>
            )}
            {question.type === "Number" && (
              <div className="mb-6">
                <input
                  className="p-4 w-full lg:w-3/5 rounded-l-lg bg-gray-800 mt-6 text-2xl"
                  type="number"
                  {...register(`question_${question.id}`, {
                    validate: (value) => {
                      const validation = question.validation;
                      for (const v of validation) {
                        if (
                          v.type === "FromTo" &&
                          v.value &&
                          typeof v.value === "object" &&
                          "from" in v.value &&
                          "to" in v.value &&
                          (value < v.value.from || value > v.value.to)
                        )
                          return `Must be between ${v.value.from} and ${v.value.to}`;

                        if (v.type === "Required" && !value)
                          return "Field is required";
                      }
                    },
                  })}
                />
                {errors[`question_${question.id}`] && (
                  <p className="text-red-500 text-xl mt-2">
                    {(errors[`question_${question.id}`] as FieldError).message}
                  </p>
                )}
              </div>
            )}
            {question.type === "True/False" && (
              <div className="inline-flex items-center">
                <input
                  className="rounded-l-lg bg-gray-800 h-6 w-6"
                  type="checkbox"
                  {...register(`question_${question.id}`)}
                />
                {errors[`question_${question.id}`] && (
                  <p className="text-red-500 text-xl mt-2">
                    {(errors[`question_${question.id}`] as FieldError).message}
                  </p>
                )}
              </div>
            )}
          </div>
        ))}
        <button
          className="p-6 my-10 rounded bg-gray-800 text-3xl"
          type="submit"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default FormTester;

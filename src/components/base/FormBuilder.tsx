import React, { useCallback, useEffect, useReducer, useState } from "react";
import QuestionInput from "../misc/QuestionInput";
import QuestionTypeSelect from "../misc/QuestionTypesSelect";
import RequiredValidation from "../misc/RequiredValidation";
import TextValidation from "../misc/TextValidation";
import FromToValidation from "../misc/FromToValidation";
import { isEqual } from "lodash";
import { toast } from "react-toastify";

export type ValidationType = "Required" | "StartsWith" | "Contains" | "FromTo";

export type QuestionType = "True/False" | "Number" | "Text";

type Validation = {
  type: ValidationType;
  value?: string | number | { from: number; to: number } | boolean;
};

export type Question = {
  id: number;
  text: string;
  type: QuestionType;
  validation: Validation[];
};

export type Form = {
  questions: Question[];
};

type AddQuestionAction = {
  type: "ADD_QUESTION";
};

type RemoveQuestionAction = {
  type: "REMOVE_QUESTION";
  payload: number;
};

type UpdateQuestionAction = {
  type: "UPDATE_QUESTION";
  payload: {
    id: number;
    text?: string;
    type?: QuestionType;
  };
};

type ToggleValidationAction = {
  type: "TOGGLE_VALIDATION";
  payload: {
    id: number;
    validationType: ValidationType;
    isChecked: boolean;
  };
};

type UpdateValidationAction = {
  type: "UPDATE_VALIDATION_VALUE";
  payload: {
    id: number;
    validationType: ValidationType;
    value?: string | { from: number; to: number };
    isChecked?: boolean;
  };
};

type SaveFormAction = {
  type: "SAVE_FORM";
};

type Action =
  | AddQuestionAction
  | RemoveQuestionAction
  | UpdateQuestionAction
  | UpdateValidationAction
  | SaveFormAction
  | ToggleValidationAction;

const formReducer = (state: Form, action: Action): Form => {
  switch (action.type) {
    case "ADD_QUESTION":
      return {
        ...state,
        questions: [
          ...state.questions,
          {
            id: Date.now(),
            text: "",
            type: "Text",
            validation: [],
          },
        ],
      };

    case "REMOVE_QUESTION":
      return {
        ...state,
        questions: state.questions.filter(
          (question) => question.id !== action.payload
        ),
      };

    case "UPDATE_QUESTION":
      return {
        ...state,
        questions: state.questions.map((question) =>
          question.id === action.payload.id
            ? { ...question, ...action.payload }
            : question
        ),
      };

    case "TOGGLE_VALIDATION": {
      const { id, validationType, isChecked } = action.payload;

      return {
        ...state,
        questions: state.questions.map((question) => {
          if (question.id !== id) return question;

          if (isChecked) {
            // Add validation
            return {
              ...question,
              validation: [
                ...question.validation,
                {
                  type: validationType,
                  value:
                    validationType === "Required"
                      ? true
                      : validationType === "FromTo"
                      ? { from: 0, to: 0 }
                      : "",
                },
              ],
            };
          } else {
            // Remove validation
            return {
              ...question,
              validation: question.validation.filter(
                (v) => v.type !== validationType
              ),
            };
          }
        }),
      };
    }

    case "UPDATE_VALIDATION_VALUE": {
      const { id, validationType, value } = action.payload;
      return {
        ...state,
        questions: state.questions.map((question) => {
          if (question.id === id) {
            return {
              ...question,
              validation: question.validation.map((v) => {
                if (v.type === validationType) {
                  return { ...v, value };
                }
                return v;
              }),
            };
          }
          return question;
        }),
      };
    }

    case "SAVE_FORM":
      localStorage.setItem("form", JSON.stringify(state));
      return state;

    default:
      return state;
  }
};

type FormBuilderProps = {
  onUnsavedChanges: (hasUnsavedChanges: boolean) => void;
};

const FormBuilder: React.FC<FormBuilderProps> = ({ onUnsavedChanges }) => {
  const defaultForm = useCallback(() => {
    const savedForm = localStorage.getItem("form");
    return savedForm ? JSON.parse(savedForm) : { questions: [] };
  }, []);
  console.log(defaultForm);
  const [form, dispatch] = useReducer(formReducer, defaultForm());
  const [isSaved, setIsSaved] = useState(false);

  const compareWithLocalStorage = useCallback(() => {
    const localStorageForm = defaultForm();
    const hasUnsavedChanges = !isEqual(localStorageForm, form);
    onUnsavedChanges(hasUnsavedChanges);
  }, [form, onUnsavedChanges, defaultForm]);

  useEffect(() => {
    if (isSaved) {
      setIsSaved(false);
    }
    compareWithLocalStorage();
  }, [form, compareWithLocalStorage, isSaved]);

  const handleAddQuestion = () => {
    dispatch({ type: "ADD_QUESTION" });
  };

  const handleRemoveQuestion = (id: number) => {
    dispatch({ type: "REMOVE_QUESTION", payload: id });
  };

  const handleTextChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    id: number
  ) => {
    dispatch({
      type: "UPDATE_QUESTION",
      payload: { id, text: e.target.value },
    });
  };

  const handleTypeChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
    id: number
  ) => {
    dispatch({
      type: "UPDATE_QUESTION",
      payload: { id, type: e.target.value as QuestionType },
    });
  };

  const handleValidationValueChange = (
    id: number,
    validationType: "StartsWith" | "Contains" | "FromTo",
    value: string | { from: number; to: number }
  ) => {
    if (validationType === "FromTo") {
      if (typeof value === "object") {
        const { from, to } = value;

        if (from > to) {
          toast.warn(
            "The 'From' value cannot be greater than the 'To' value.",
            { className: "my-toast" }
          );
          return;
        }

        if (from < 0 || to < 0) {
          toast.warn("Both 'From' and 'To' values must be non-negative.", {
            className: "my-toast",
          });
          return;
        }

        if (from === to) {
          toast.warn("The 'From' and 'To' values should not be the same.", {
            className: "my-toast",
          });
          return;
        }
      }
    }

    dispatch({
      type: "UPDATE_VALIDATION_VALUE",
      payload: { id, validationType, value },
    });
  };

  const handleValidationToggle = (
    id: number,
    validationType: ValidationType,
    isChecked: boolean
  ) => {
    dispatch({
      type: "TOGGLE_VALIDATION",
      payload: { id, validationType, isChecked },
    });
  };

  const handleSaveForm = () => {
    dispatch({ type: "SAVE_FORM" });
    setIsSaved(true);
    toast("Form saved successfully!", { className: "my-toast" });
  };

  return (
    <div className="my-8 text-2xl">
      <h1 className="text-8xl my-16">Form Builder</h1>
      <button className="mr-4" onClick={handleAddQuestion}>
        Add Question
      </button>
      {form.questions.map((question) => (
        <div key={question.id} className="my-8 py-2 relative">
          <QuestionInput
            value={question.text}
            onChange={(e) => handleTextChange(e, question.id)}
          />
          <QuestionTypeSelect
            value={question.type}
            onChange={(e) => handleTypeChange(e, question.id)}
          />
          <button
            className="my-5 absolute right-0 bottom-0 sm:static sm:mx-5 text-base"
            onClick={() => handleRemoveQuestion(question.id)}
          >
            Remove
          </button>
          <div className="my-4 flex flex-col sm:flex-row flex-wrap gap-8">
            <RequiredValidation
              checked={question.validation.some((v) => v.type === "Required")}
              onToggle={(checked) =>
                handleValidationToggle(question.id, "Required", checked)
              }
            />
            {question.type === "Text" && (
              <>
                <TextValidation
                  type="StartsWith"
                  placeholder="Starts with..."
                  checked={question.validation.some(
                    (v) => v.type === "StartsWith"
                  )}
                  value={
                    (question.validation.find((v) => v.type === "StartsWith")
                      ?.value as string) || ""
                  }
                  onToggle={(checked) =>
                    handleValidationToggle(question.id, "StartsWith", checked)
                  }
                  onChange={(value) =>
                    handleValidationValueChange(
                      question.id,
                      "StartsWith",
                      value
                    )
                  }
                />
                <TextValidation
                  type="Contains"
                  checked={question.validation.some(
                    (v) => v.type === "Contains"
                  )}
                  value={
                    (question.validation.find((v) => v.type === "Contains")
                      ?.value as string) || ""
                  }
                  placeholder="Contains..."
                  onToggle={(checked) =>
                    handleValidationToggle(question.id, "Contains", checked)
                  }
                  onChange={(value) =>
                    handleValidationValueChange(question.id, "Contains", value)
                  }
                />
              </>
            )}
            {question.type === "Number" && (
              <>
                <FromToValidation
                  checked={question.validation.some((v) => v.type === "FromTo")}
                  from={
                    (
                      question.validation.find((v) => v.type === "FromTo")
                        ?.value as { from: number; to: number }
                    )?.from || ""
                  }
                  to={
                    (
                      question.validation.find((v) => v.type === "FromTo")
                        ?.value as { from: number; to: number }
                    )?.to || ""
                  }
                  onToggle={(checked) =>
                    handleValidationToggle(question.id, "FromTo", checked)
                  }
                  onChangeFrom={(e) =>
                    handleValidationValueChange(question.id, "FromTo", {
                      from: Number(e),
                      to: (
                        question.validation.find((v) => v.type === "FromTo")
                          ?.value as { from: number; to: number }
                      ).to,
                    })
                  }
                  onChangeTo={(e) =>
                    handleValidationValueChange(question.id, "FromTo", {
                      from: (
                        question.validation.find((v) => v.type === "FromTo")
                          ?.value as { from: number; to: number }
                      ).from,
                      to: Number(e),
                    })
                  }
                />
              </>
            )}
          </div>
        </div>
      ))}
      {((form && form.questions.length > 0) ||
        (localStorage.getItem("form") !== null &&
          typeof localStorage.getItem("form") === "string" &&
          JSON.parse(localStorage.getItem("form") as string).questions.length >
            0)) && <button onClick={handleSaveForm}>Save</button>}
    </div>
  );
};

export default FormBuilder;

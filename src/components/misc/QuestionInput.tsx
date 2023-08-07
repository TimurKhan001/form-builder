import React from "react";

type QuestionInputProps = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const QuestionInput: React.FC<QuestionInputProps> = ({ value, onChange }) => (
  <input
    className="p-4 w-full rounded-t-lg sm:w-3/5 sm:rounded-tr-none sm:rounded-l-lg bg-gray-800"
    type="text"
    placeholder="Question text"
    value={value}
    onChange={onChange}
  />
);

export default QuestionInput;

import type { QuestionType } from "../base/FormBuilder";

type QuestionTypeSelectProps = {
  value: QuestionType;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
};

const QuestionTypeSelect: React.FC<QuestionTypeSelectProps> = ({
  value,
  onChange,
}) => (
  <select
    className="p-4 w-full rounded-b-lg sm:w-auto mr-4 sm:rounded-bl-none sm:rounded-r-lg bg-gray-700"
    value={value}
    onChange={onChange}
  >
    <option value="Text">Text</option>
    <option value="Number">Number</option>
    <option value="True/False">True/False</option>
  </select>
);

export default QuestionTypeSelect;

interface TextValidationProps {
  type: "StartsWith" | "Contains";
  checked: boolean;
  value: string;
  placeholder: string;
  onToggle: (checked: boolean) => void;
  onChange: (value: string) => void;
}

const TextValidation: React.FC<TextValidationProps> = ({
  type,
  checked,
  value,
  placeholder,
  onToggle,
  onChange,
}) => {
  return (
    <>
      <label>
        <input
          className="mr-2"
          type="checkbox"
          checked={checked}
          onChange={(e) => onToggle(e.target.checked)}
        />
        {type}...
      </label>
      {checked && (
        <input
          className="px-2 rounded w-1/2 sm:w-1/6"
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </>
  );
};

export default TextValidation;

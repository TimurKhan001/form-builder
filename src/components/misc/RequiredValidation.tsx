type RequiredValidationProps = {
  checked: boolean;
  onToggle: (checked: boolean) => void;
};

export const RequiredValidation: React.FC<RequiredValidationProps> = ({
  checked,
  onToggle,
}) => (
  <label>
    <input
      type="checkbox"
      className="mr-2"
      checked={checked}
      onChange={(e) => onToggle(e.target.checked)}
    />
    Required
  </label>
);

export default RequiredValidation;

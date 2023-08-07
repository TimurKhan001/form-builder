interface FromToValidationProps {
  checked: boolean;
  from: number | string;
  to: number | string;
  onToggle: (checked: boolean) => void;
  onChangeFrom: (value: number) => void;
  onChangeTo: (value: number) => void;
}

const FromToValidation: React.FC<FromToValidationProps> = ({
  checked,
  from,
  to,
  onToggle,
  onChangeFrom,
  onChangeTo,
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
        From...To
      </label>
      {checked && (
        <>
          <input
            className="px-2 rounded w-1/2 sm:w-1/6"
            type="number"
            placeholder="From..."
            value={from}
            onChange={(e) => onChangeFrom(Number(e.target.value))}
          />
          <input
            className="px-2 rounded w-1/2 sm:w-1/6"
            type="number"
            placeholder="To..."
            value={to}
            onChange={(e) => onChangeTo(Number(e.target.value))}
          />
        </>
      )}
    </>
  );
};

export default FromToValidation;

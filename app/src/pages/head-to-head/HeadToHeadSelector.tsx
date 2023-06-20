interface IProps {
  options: string[];
  label: string;
  defaultValue: string;
  handleChange: (name: string) => void;
}

export const HeadToHeadSelector = ({
  options,
  label,
  defaultValue,
  handleChange,
}: IProps) => {
  return (
    <div className="form-control">
      <label className="label">
        <span className="label-text">{label}</span>
      </label>

      <select
        className="select select-primary"
        onChange={(e) => handleChange(e.target.value)}
        defaultValue={defaultValue}
      >
        <option value={defaultValue} disabled>
          {defaultValue}
        </option>

        {options.map((name) => (
          <option key={name} value={name}>
            {name}
          </option>
        ))}
      </select>
    </div>
  );
};

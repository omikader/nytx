import classNames from "classnames";

interface IProps {
  options: string[];
  label: string;
  defaultValue: string;
  handleChange: (name: string) => void;
  style?: string;
}

export const HeadToHeadSelector = ({
  options,
  label,
  defaultValue,
  handleChange,
  style = "select-bordered",
}: IProps) => {
  return (
    <div className="form-control">
      <label className="label">
        <span className="label-text">{label}</span>
      </label>

      <select
        className={classNames("select", style)}
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

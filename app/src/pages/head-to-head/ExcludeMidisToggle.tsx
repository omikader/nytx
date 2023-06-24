import { Dispatch, SetStateAction } from "react";

interface IProps {
  excludeMidis: boolean;
  handleChange: Dispatch<SetStateAction<boolean>>;
}

export const ExcludeMidisToggle = ({ excludeMidis, handleChange }: IProps) => {
  return (
    <div className="form-control">
      <label className="label cursor-pointer">
        <span
          className="label-text tooltip tooltip-bottom"
          data-tip="Ignore Saturday puzzles from the analysis"
        >
          Exclude Midis?
        </span>
        <input
          type="checkbox"
          className="toggle"
          checked={excludeMidis}
          onChange={() => handleChange((prev) => !prev)}
        />
      </label>
    </div>
  );
};

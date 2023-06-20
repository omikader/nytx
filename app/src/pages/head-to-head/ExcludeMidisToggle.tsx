import { Dispatch, SetStateAction } from "react";

interface IProps {
  excludeMidis: boolean;
  handleChange: Dispatch<SetStateAction<boolean>>;
}

export const ExcludeMidisToggle = ({ excludeMidis, handleChange }: IProps) => {
  return (
    <div
      className="form-control tooltip tooltip-bottom"
      data-tip="Ignore Saturday puzzles from the analysis"
    >
      <label className="label cursor-pointer">
        <span className="label-text">Exclude Midis?</span>
        <input
          type="checkbox"
          className="toggle toggle-primary"
          checked={excludeMidis}
          onChange={() => handleChange((prev) => !prev)}
        />
      </label>
    </div>
  );
};

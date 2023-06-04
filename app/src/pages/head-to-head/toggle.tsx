import { Dispatch, SetStateAction } from "react";

interface IProps {
  excludeMidis: boolean;
  handleChange: Dispatch<SetStateAction<boolean>>;
}

export const ExcludeMidisToggle = ({ excludeMidis, handleChange }: IProps) => {
  return (
    <div
      className="form-control tooltip tooltip-bottom mb-5"
      data-tip="Ignore Saturday puzzles from the analysis"
    >
      <label className="label cursor-pointer">
        <input
          type="checkbox"
          className="toggle"
          checked={excludeMidis}
          onChange={() => handleChange((prev) => !prev)}
        />
        <span className="label-text">Exclude Midis?</span>
      </label>
    </div>
  );
};

import { Dispatch, SetStateAction } from "react";

interface IProps {
  excludeMidis: boolean;
  handleChange: Dispatch<SetStateAction<boolean>>;
}

export const ExcludeMidisCheckbox = ({
  excludeMidis,
  handleChange,
}: IProps) => {
  return (
    <div uk-tooltip="title: Ignore Saturday puzzles from the analysis; pos: bottom">
      <label>
        <input
          className="uk-checkbox uk-margin-small-right"
          type="checkbox"
          checked={excludeMidis}
          onChange={() => handleChange((prev) => !prev)}
        />
        Exclude Midis?
      </label>
    </div>
  );
};

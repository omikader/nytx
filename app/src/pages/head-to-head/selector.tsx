interface IProps {
  options: string[];
  caption: string;
  handleChange: (name: string) => void;
}

export const HeadToHeadSelector = ({
  options,
  caption,
  handleChange,
}: IProps) => {
  return (
    <div className="uk-margin">
      <select
        className="uk-select uk-form-width-medium"
        onChange={(e) => handleChange(e.target.value)}
        defaultValue={"_nytx_default_"}
      >
        <option value={"_nytx_default_"} disabled>
          {caption}
        </option>

        {options.map((name) => (
          <option key={name}>{name}</option>
        ))}
      </select>
    </div>
  );
};

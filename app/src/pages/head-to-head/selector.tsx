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
    <div className="mb-5">
      <select
        className="select select-bordered"
        onChange={(e) => handleChange(e.target.value)}
      >
        <option disabled selected>
          {caption}
        </option>
        {options.map((name) => (
          <option key={name}>{name}</option>
        ))}
      </select>
    </div>
  );
};

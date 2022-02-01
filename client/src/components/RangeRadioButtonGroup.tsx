export default function RangeRadioButtonGroup({
  range,
  onChange,
}: {
  range: string;
  onChange: (newRange: string) => void;
}) {
  return (
    <div>
      <input
        type="radio"
        name="range"
        value={"0,d"}
        checked={range === "0,d"}
        onChange={(event) => onChange(event.target.value)}
      />
      1D
      <input
        type="radio"
        name="range"
        value={"1,w"}
        checked={range === "1,w"}
        onChange={(event) => onChange(event.target.value)}
      />
      1W
      <input
        type="radio"
        name="range"
        value={"1,M"}
        checked={range === "1,M"}
        onChange={(event) => onChange(event.target.value)}
      />
      1M
      <input
        type="radio"
        name="range"
        value={"3,M"}
        checked={range === "3,M"}
        onChange={(event) => onChange(event.target.value)}
      />
      3M
    </div>
  );
}

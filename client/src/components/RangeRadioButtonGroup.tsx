export default function RangeRadioButtonGroup({
  range,
  onChange,
}: {
  range: string;
  onChange: (newRange: string) => void;
}) {
  return (
    <form>
      <div className="uk-grid-collapse" uk-grid="true">
        <label>
          <input
            type="radio"
            name="range"
            value={"1,w"}
            checked={range === "1,w"}
            onChange={(event) => onChange(event.target.value)}
          />
          1W
        </label>
        <label>
          <input
            type="radio"
            name="range"
            value={"1,M"}
            checked={range === "1,M"}
            onChange={(event) => onChange(event.target.value)}
          />
          1M
        </label>
        <label>
          <input
            type="radio"
            name="range"
            value={"3,M"}
            checked={range === "3,M"}
            onChange={(event) => onChange(event.target.value)}
          />
          3M
        </label>
        <label>
          <input
            type="radio"
            name="range"
            value={"6,M"}
            checked={range === "6,M"}
            onChange={(event) => onChange(event.target.value)}
          />
          6M
        </label>
        <label>
          <input
            type="radio"
            name="range"
            value={"1,Y"}
            checked={range === "1,Y"}
            onChange={(event) => onChange(event.target.value)}
          />
          1Y
        </label>
      </div>
    </form>
  );
}

import { GetHead2Head } from "../api/get-head-to-head";

function toHHMMSS(seconds: number) {
  if (seconds === 0) return "N/A";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.round(seconds % 60);
  return [h, m > 9 ? m : h ? "0" + m : m || "0", s > 9 ? s : "0" + s]
    .filter(Boolean)
    .join(":");
}

export default function HeadToHeadTable({
  name1,
  name2,
  data,
}: {
  name1?: string;
  name2?: string;
  data?: GetHead2Head;
}) {
  if (name1 === undefined || name2 === undefined || data === undefined) {
    return <></>;
  }

  return (
    <table className="uk-table uk-table-divider">
      <thead>
        <tr>
          <th className="uk-width-small uk-text-center">{name1}</th>
          <th className="uk-width-small" />
          <th className="uk-width-small uk-text-center">{name2}</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{data.headToHeadRecord.wins}</td>
          <td>Wins</td>
          <td>{data.headToHeadRecord.losses}</td>
        </tr>
        <tr>
          <td>{data.headToHeadRecord.losses}</td>
          <td>Losses</td>
          <td>{data.headToHeadRecord.wins}</td>
        </tr>
        <tr>
          <td>{data.headToHeadRecord.ties}</td>
          <td>Ties</td>
          <td>{data.headToHeadRecord.ties}</td>
        </tr>
        <tr>
          <td>{toHHMMSS(data.headToHeadRecord.avg1)}</td>
          <td>Avg. Time</td>
          <td>{toHHMMSS(data.headToHeadRecord.avg2)}</td>
        </tr>
      </tbody>
    </table>
  );
}

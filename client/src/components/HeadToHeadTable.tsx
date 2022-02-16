import { GetHead2Head } from "../api/get-head-to-head";

export default function HeadToHeadTable({
  name1,
  name2,
  data,
}: {
  name1?: string;
  name2?: string;
  data?: GetHead2Head;
}) {
  if (name1 === undefined || name2 == undefined || data === undefined) {
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
          <td>Draws</td>
          <td>{data.headToHeadRecord.ties}</td>
        </tr>
      </tbody>
    </table>
  );
}

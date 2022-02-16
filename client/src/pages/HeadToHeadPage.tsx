import React from "react";
import { useQuery } from "@apollo/client";

import HeadToHeadTable from "../components/HeadToHeadTable";
import QueryResult from "../api/query-result";
import useUsers from "../hooks/useUsers";
import { GetHead2Head, HEAD2HEAD } from "../api/get-head-to-head";

export default function HeadToHeadPage() {
  const {
    data: { users },
  } = useUsers();
  const [name1, setName1] = React.useState<string>();
  const [name2, setName2] = React.useState<string>();
  const { loading, error, data } = useQuery<GetHead2Head>(HEAD2HEAD, {
    variables: { name1, name2 },
    skip: name1 === undefined || name2 === undefined,
  });

  const sortedUsers = [...users].sort((a, b) => (a.name > b.name ? 1 : -1));
  return (
    <div>
      <form>
        <div className="uk-margin">
          <select
            className="uk-select uk-form-width-medium"
            onChange={(event) => setName1(event.target.value)}
            defaultValue={"_nytx_default_"}
          >
            <option value={"_nytx_default_"} disabled>
              Choose a name...
            </option>
            {sortedUsers
              .filter((user) => user.name !== name2)
              .map((user) => (
                <option key={user.name}>{user.name}</option>
              ))}
          </select>
        </div>
        <div className="uk-margin">
          <select
            className="uk-select uk-form-width-medium"
            onChange={(event) => setName2(event.target.value)}
            defaultValue={"_nytx_default_"}
          >
            <option value={"_nytx_default_"} disabled>
              Choose another...
            </option>
            {sortedUsers
              .filter((user) => user.name !== name1)
              .map((user) => (
                <option key={user.name}>{user.name}</option>
              ))}
          </select>
        </div>
      </form>
      <QueryResult loading={loading} error={error}>
        <HeadToHeadTable name1={name1} name2={name2} data={data} />
      </QueryResult>
    </div>
  );
}

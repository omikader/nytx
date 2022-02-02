import React from "react";
import styled from "styled-components";
import { useSortBy, useTable } from "react-table";

import { GetLatestRatings } from "../api/graphql";

const Table = styled.table`
  border: solid 1px blue;
`;

const Th = styled.th`
  border-bottom: solid 3px red;
  background: aliceblue;
  color: black;
  font-weight: bold;
`;

const Td = styled.td`
  padding: 10px;
  border: solid 1px gray;
  background: papayawhip;
`;

export default function StandingsTable({ data }: { data: GetLatestRatings }) {
  const tableData = React.useMemo(
    () =>
      data.latestRatings.map(({ mu, sigma, eta, ...rating }) => {
        return {
          mu: mu.toFixed(2),
          sigma: sigma.toFixed(2),
          eta: Math.max(eta, 0).toFixed(2),
          ...rating,
        };
      }) as any,
    [data.latestRatings]
  );
  const columns = React.useMemo(
    () => [
      { Header: "#", id: "idx" },
      {
        Header: "Name",
        id: "name",
        accessor: "user.name",
      },
      { Header: "Rating", id: "rating", accessor: "eta", sortDescFirst: true },
      {
        Header: "Estimate",
        id: "estimate",
        accessor: "mu",
        sortDescFirst: true,
      },
      { Header: "Uncertainty", id: "uncertainty", accessor: "sigma" },
      {
        Header: "Games Played",
        id: "gp",
        accessor: "user.gamesPlayed",
        sortDescFirst: true,
      },
      { Header: "Last Play", id: "lp", accessor: "date", sortDescFirst: true },
    ],
    []
  );
  const initialSortBy = React.useMemo(() => [{ id: "rating", desc: true }], []);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable(
      {
        columns,
        data: tableData,
        initialState: { sortBy: initialSortBy },
      },
      useSortBy
    );

  return (
    <Table {...getTableProps()}>
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <Th {...column.getHeaderProps(column.getSortByToggleProps())}>
                {column.render("Header")}
                <span>
                  {column.isSorted ? (column.isSortedDesc ? " 🔽" : " 🔼") : ""}
                </span>
              </Th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row, i) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map((cell) => {
                return (
                  <Td {...cell.getCellProps()}>
                    {cell.column.id === "idx" ? i + 1 : cell.render("Cell")}
                  </Td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
}

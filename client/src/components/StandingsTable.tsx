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
          eta: eta.toFixed(2),
          ...rating,
        };
      }) as any,
    [data.latestRatings]
  );
  const columns = React.useMemo(
    () => [
      { Header: "#" },
      { Header: "Name", accessor: "user.name" },
      { Header: "Estimate", accessor: "mu" },
      { Header: "Uncertainty", accessor: "sigma" },
      { Header: "Rating", accessor: "eta" },
      { Header: "Games Played", accessor: "user.gamesPlayed" },
      { Header: "Last Play", accessor: "date" },
    ],
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data: tableData }, useSortBy);

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
                    {cell.column.Header === "#" ? i + 1 : cell.render("Cell")}
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

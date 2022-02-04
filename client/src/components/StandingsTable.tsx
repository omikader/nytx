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
    () => data.latestRatings as any,
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
      {
        Header: "Rating",
        id: "rating",
        accessor: "eta",
        sortDescFirst: true,
        Cell: (props: any) => props.value.toFixed(2),
      },
      {
        Header: "Estimate",
        id: "estimate",
        accessor: "mu",
        sortDescFirst: true,
        Cell: (props: any) => props.value.toFixed(2),
      },
      {
        Header: "Uncertainty",
        id: "uncertainty",
        accessor: "sigma",
        Cell: (props: any) => props.value.toFixed(2),
      },
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
    <Table {...getTableProps()} className="responsiveTable">
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
                  <Td {...cell.getCellProps()} className="pivoted">
                    {headerGroups.map((headerGroup) =>
                      headerGroup.headers.map((column, i) => {
                        return cell.column.Header === column.Header ? (
                          <Th
                            {...column.getHeaderProps(
                              column.getSortByToggleProps()
                            )}
                            className="tdBefore"
                          >
                            {column.render("Header")}
                            <span>
                              {column.isSorted
                                ? column.isSortedDesc
                                  ? " 🔽"
                                  : " 🔼"
                                : ""}
                            </span>
                          </Th>
                        ) : null;
                      })
                    )}
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

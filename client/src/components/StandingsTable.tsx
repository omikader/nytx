import React from "react";
import styled, { css } from "styled-components";
import { useSortBy, useTable } from "react-table";

import { GetLatestRatings } from "../api/get-latest-ratings";

const Table = styled.table`
  border: solid 1px blue;
`;

const headerStyles = css`
  border-bottom: solid 3px red;
  background: aliceblue;
  color: black;
  font-weight: bold;
`;

const TableHeader = styled.th`
  ${headerStyles}
`;

const DivHeader = styled.div`
  ${headerStyles}
`;

const TableData = styled.td`
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
        sortType: "number",
      },
      {
        Header: "Estimate",
        id: "estimate",
        accessor: "mu",
        sortDescFirst: true,
        Cell: (props: any) => props.value.toFixed(2),
        sortType: "number",
      },
      {
        Header: "Uncertainty",
        id: "uncertainty",
        accessor: "sigma",
        Cell: (props: any) => props.value.toFixed(2),
        sortType: "number",
      },
      {
        Header: "Games Played",
        id: "gp",
        accessor: "user.gamesPlayed",
        sortDescFirst: true,
        sortType: "number",
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
              <TableHeader
                {...column.getHeaderProps(column.getSortByToggleProps())}
              >
                {column.render("Header")}
                <span>
                  {column.isSorted ? (column.isSortedDesc ? " 🔽" : " 🔼") : ""}
                </span>
              </TableHeader>
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
                  <TableData {...cell.getCellProps()} className="pivoted">
                    {headerGroups.map((headerGroup) =>
                      headerGroup.headers.map((column) => {
                        return cell.column.Header === column.Header ? (
                          <DivHeader
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
                          </DivHeader>
                        ) : null;
                      })
                    )}
                    {cell.column.id === "idx" ? i + 1 : cell.render("Cell")}
                  </TableData>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
}

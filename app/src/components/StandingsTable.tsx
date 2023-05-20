import "../theme/ResponsiveTable.css";

import React from "react";
import { useSortBy, useTable } from "react-table";

import { GetLatestRatings } from "../api/get-latest-ratings";

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
      {
        Header: "Current Streak",
        id: "cs",
        accessor: "user.currentStreak",
        sortDescFirst: true,
        sortType: "number",
      },
      {
        Header: "Max Streak",
        id: "ms",
        accessor: "user.maxStreak",
        sortDescFirst: true,
        sortType: "number",
      },
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
    <table
      {...getTableProps()}
      className="uk-table uk-table-striped uk-table-hover responsiveTable"
    >
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <th
                className="uk-text-center"
                {...column.getHeaderProps(column.getSortByToggleProps())}
              >
                {column.render("Header")}
                <span>
                  {column.isSorted ? (column.isSortedDesc ? " 🔽" : " 🔼") : ""}
                </span>
              </th>
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
                  <td {...cell.getCellProps()} className="pivoted">
                    {headerGroups.map((headerGroup) =>
                      headerGroup.headers.map((column) => {
                        return cell.column.Header === column.Header ? (
                          <div
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
                          </div>
                        ) : null;
                      })
                    )}
                    {cell.column.id === "idx" ? i + 1 : cell.render("Cell")}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

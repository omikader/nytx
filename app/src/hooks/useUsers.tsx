import React from "react";
import { useQuery } from "@apollo/client";

import QueryResult from "../api/query-result";
import { GetUsers, USERS } from "../api/get-users";

interface UsersContextType {
  data: GetUsers;
}

const UsersContext = React.createContext<UsersContextType>(
  {} as UsersContextType
);

export function UsersProvider({ children }: { children: React.ReactNode }) {
  const { loading, error, data } = useQuery<GetUsers>(USERS);
  return (
    <QueryResult loading={loading} error={error}>
      <UsersContext.Provider value={{ data: data! }}>
        {children}
      </UsersContext.Provider>
    </QueryResult>
  );
}

export default function useUsers() {
  return React.useContext(UsersContext);
}

import "./index.css";

import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import { HeadToHeadPage, HomePage, NotFoundPage, Root } from "./pages";
import { PuzzleProvider } from "./contexts";

const client = new ApolloClient({
  uri: import.meta.env.VITE_API_URL,
  cache: new InMemoryCache(),
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <NotFoundPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "ratings", lazy: () => import("./pages/ratings") },
      { path: "h2h", element: <HeadToHeadPage /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <React.StrictMode>
      <ApolloProvider client={client}>
        <PuzzleProvider>
          <RouterProvider router={router} />
        </PuzzleProvider>
      </ApolloProvider>
    </React.StrictMode>
  </React.StrictMode>
);

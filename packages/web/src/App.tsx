import "./theme/App.css";

import { BrowserRouter } from "react-router-dom";

import Router from "./components/Router";
import { UsersProvider } from "./hooks/useUsers";

export default function App() {
  return (
    <BrowserRouter>
      <UsersProvider>
        <Router />
      </UsersProvider>
    </BrowserRouter>
  );
}

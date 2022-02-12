import { BrowserRouter } from "react-router-dom";

import GlobalStyle from "./theme/globalStyles";
import Router from "./components/Router";
import { UsersProvider } from "./hooks/useUsers";

export default function App() {
  return (
    <BrowserRouter>
      <GlobalStyle />
      <UsersProvider>
        <Router />
      </UsersProvider>
    </BrowserRouter>
  );
}

import GlobalStyle from "./theme/globalStyles";
import Home from "./pages/Home";

export default function App() {
  return (
    <>
      <GlobalStyle />
      <header>
        <h1>omikader + friends' historical NYT mini leaderboard</h1>
      </header>
      <div>
        <Home />
      </div>
    </>
  );
}

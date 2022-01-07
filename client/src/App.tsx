import "./App.css";

import RangedLineChart from "./components/RangedLineChart";

export default function App() {
  return (
    <div className="App">
      <header>
        <h1>omikader + friends' historical NYT mini leaderboard</h1>
      </header>
      <div className="App-content">
        <RangedLineChart />
      </div>
    </div>
  );
}

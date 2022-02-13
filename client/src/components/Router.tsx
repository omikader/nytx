import { Route, Routes } from "react-router-dom";

import HomePage from "../pages/HomePage";
import Navbar from "./Navbar";
import NotFoundPage from "../pages/NotFoundPage";
import RatingsPage from "../pages/RatingsPage";
import StandingsPage from "../pages/StandingsPage";

export default function Router() {
  return (
    <Routes>
      <Route element={<Navbar />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/standings" element={<StandingsPage />} />
        <Route path="/ratings" element={<RatingsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
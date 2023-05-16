import React, { Suspense } from "react";
import { Route, Routes } from "react-router-dom";

import Spinner from "./Spinner";

const HeadToHeadPage = React.lazy(() => import("../pages/HeadToHeadPage"));
const HomePage = React.lazy(() => import("../pages/HomePage"));
const Navbar = React.lazy(() => import("./Navbar"));
const NotFoundPage = React.lazy(() => import("../pages/NotFoundPage"));
const StandingsPage = React.lazy(() => import("../pages/StandingsPage"));
const RatingsChartPage = React.lazy(() => import("../pages/RatingsChartPage"));

export default function Router() {
  return (
    <Suspense fallback={<Spinner />}>
      <Routes>
        <Route path="/" element={<Navbar />}>
          <Route index element={<HomePage />} />
          <Route path="standings" element={<StandingsPage />} />
          <Route path="chart" element={<RatingsChartPage />} />
          <Route path="h2h" element={<HeadToHeadPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

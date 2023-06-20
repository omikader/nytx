import { Link, Outlet } from "react-router-dom";

import { GitHubIcon } from "../svg";

export const Root = () => {
  return (
    <div className="flex flex-col place-items-center">
      <div className="navbar bg-base-100">
        <div className="navbar-start" />

        <div className="navbar-center">
          <Link className="btn btn-ghost normal-case text-2xl" to="/">
            nytx
          </Link>

          <ul className="menu menu-horizontal">
            <li>
              <Link to="/ratings">Ratings</Link>
            </li>
            <li>
              <Link to="/h2h">H2H</Link>
            </li>
          </ul>

          <a
            aria-label="GitHub"
            href="https://github.com/omikader/nytx"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost btn-circle"
          >
            <GitHubIcon />
          </a>
        </div>

        <div className="navbar-end" />
      </div>

      <div className="py-12 w-11/12">
        <Outlet />
      </div>
    </div>
  );
};

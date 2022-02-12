import { Link, Outlet } from "react-router-dom";

export default function Navbar() {
  return (
    <div>
      <div uk-sticky="sel-target: .uk-navbar-container; cls-active: uk-navbar-sticky">
        <nav className="uk-navbar-container" uk-navbar="true">
          <div className="uk-navbar-left">
            <ul className="uk-navbar-nav">
              <Link className="uk-navbar-item uk-logo" to="/">
                nytx
              </Link>
              <li>
                <Link to="/standings">Standings</Link>
              </li>
              <li>
                <Link to="/ratings">Ratings</Link>
              </li>
            </ul>
          </div>
        </nav>
      </div>
      <div className="uk-section">
        <div className="uk-container uk-container-large">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

import { Link, Outlet } from "react-router-dom";

export const Root = () => {
  return (
    <div>
      <div uk-sticky="sel-target: .uk-navbar-container; cls-active: uk-navbar-sticky">
        <nav className="uk-navbar-container" uk-navbar="true">
          <div className="uk-navbar-center">
            <Link className="uk-navbar-item uk-logo" to="/">
              nytx
            </Link>
            <ul className="uk-navbar-nav">
              <li>
                <Link to="/ratings">Ratings</Link>
              </li>
              <li>
                <Link to="/h2h">H2H</Link>
              </li>
            </ul>
            <a
              className="uk-navbar-item"
              href="https://github.com/omikader/nytx"
              target="_blank"
              rel="noopener noreferrer"
              uk-icon="github"
            />
          </div>
        </nav>
      </div>
      <div className="uk-section uk-section-small uk-section-default">
        <div className="uk-container">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

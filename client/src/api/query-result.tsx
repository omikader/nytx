import { ApolloError } from "@apollo/client";

import Spinner from "../components/Spinner";
import logo from "../logo.svg";

export default function QueryResult({
  children,
  loading,
  error,
}: {
  children: JSX.Element;
  loading: boolean;
  error?: ApolloError;
}) {
  if (error)
    return (
      <div className="uk-position-center">
        <p className="uk-text-danger">Error! {error.message}</p>
      </div>
    );
  if (loading)
    return (
      <div className="uk-position-center">
        <Spinner src={logo} alt="logo" />
      </div>
    );
  return children;
}

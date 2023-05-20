import { ApolloError } from "@apollo/client";

import Spinner from "../components/Spinner";

export default function QueryResult({
  children,
  loading,
  error,
}: {
  children: JSX.Element;
  loading: boolean;
  error?: ApolloError;
}) {
  if (error) {
    return (
      <div className="uk-alert-danger uk-padding-small" uk-alert="true">
        <p className="uk-margin-remove-bottom">Error! {error.message}</p>
      </div>
    );
  }
  if (loading) {
    return <Spinner />;
  }
  return children;
}

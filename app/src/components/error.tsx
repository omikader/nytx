import { ApolloError } from "@apollo/client";

interface IProps {
  error: ApolloError;
}

export const Error = ({ error }: IProps) => {
  return (
    <div className="uk-alert-danger uk-padding-small" uk-alert="true">
      <p className="uk-margin-remove-bottom">Error! {error.message}</p>
    </div>
  );
};

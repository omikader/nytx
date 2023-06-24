import { ApolloError } from "@apollo/client";
import { useEffect, useState } from "react";

interface IProps {
  error: ApolloError;
}

export const ApolloErrorToast = ({ error }: IProps) => {
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsHidden(true), 3000);
    return () => clearTimeout(timer);
  }, [setIsHidden]);

  return isHidden ? null : (
    <div className="toast">
      <div className="alert alert-error">
        <span className="text-sm">
          {error.name}: {error.message}
        </span>
      </div>
    </div>
  );
};

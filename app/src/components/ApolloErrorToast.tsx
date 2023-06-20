import { ApolloError } from "@apollo/client";
import { useEffect, useState } from "react";

interface IProps {
  error: ApolloError;
}

export const ApolloErrorToast = ({ error }: IProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(false), 3000);
    return () => clearTimeout(timer);
  }, [setIsVisible]);

  return isVisible ? (
    <div className="toast">
      <div className="alert alert-error">
        <span className="text-sm">
          {error.name}: {error.message}
        </span>
      </div>
    </div>
  ) : null;
};

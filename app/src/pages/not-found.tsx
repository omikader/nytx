import { WarningIcon } from "../svg";

export const NotFoundPage = () => {
  return (
    <div className="flex gap-5 h-screen justify-center items-center">
      <WarningIcon size={16} />
      <h1 className="text-2xl">Oops! Page not found</h1>
    </div>
  );
};

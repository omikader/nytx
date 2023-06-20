interface IProps {
  size?: number;
}

export const LightningIcon = ({ size = 8 }: IProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      height="32"
      width="32"
      viewBox="0 0 24 24"
      className={`inline-block w-${size} h-${size} stroke-current`}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M13 10V3L4 14h7v7l9-11h-7z"
      ></path>
    </svg>
  );
};

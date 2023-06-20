interface IProps {
  size?: number;
}

export const InfoIcon = ({ size = 8 }: IProps) => {
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
        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      ></path>
    </svg>
  );
};

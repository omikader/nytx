import { useEffect, useState } from "react";

import { usePuzzle } from ".";

const ONE_SECOND_IN_MS = 1000;
const ONE_MINUTE_IN_MS = ONE_SECOND_IN_MS * 60;
const ONE_HOUR_IN_MS = ONE_MINUTE_IN_MS * 60;
const ONE_DAY_IN_MS = ONE_HOUR_IN_MS * 24;

interface IProps {
  date: Date;
}

export const useTimer = ({ date }: IProps) => {
  const [referenceTime, setReferenceTime] = useState(Date.now());
  const [difference, setDifference] = useState(date.getTime() - referenceTime);

  const { refetch } = usePuzzle();

  useEffect(() => {
    const countdown = () => {
      setDifference((prevDifference) => {
        if (prevDifference <= 0) {
          refetch();
          return 0;
        }

        const now = Date.now();
        const interval = now - referenceTime;
        setReferenceTime(now);
        return prevDifference - interval;
      });
    };

    setTimeout(countdown, 1000);
  }, [referenceTime, setReferenceTime, setDifference]);

  return {
    days: Math.floor(difference / ONE_DAY_IN_MS),
    hours: Math.floor((difference / ONE_HOUR_IN_MS) % 24),
    minutes: Math.floor((difference / ONE_MINUTE_IN_MS) % 60),
    seconds: Math.floor((difference / ONE_SECOND_IN_MS) % 60),
  };
};

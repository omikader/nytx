import { P, match } from "ts-pattern";

export const START = "2023-06-03";
export const ZONE = "America/New_York";

export const parseKey = (key: string): string => {
  return key.split("#")[1];
};

export const toHHMMSS = (seconds: number): string => {
  const date = new Date(seconds * 1000);

  return match({ ms: date.getTime() })
    .with({ ms: 0 }, () => "--")
    .with({ ms: P.lt(600e3) }, () => date.toISOString().substring(15, 19))
    .with({ ms: P.lt(3600e3) }, () => date.toISOString().substring(14, 19))
    .otherwise(() => date.toISOString().substring(11, 16));
};

export const fromHHMMSS = (time: string): number => {
  return time.split(":").reduce((acc, time) => 60 * acc + +time, 0);
};

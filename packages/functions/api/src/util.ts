import { P, match } from "ts-pattern";

export const START = "2023-05-30";
export const ZONE = "America/New_York";

export const parseKey = (key: string): string => {
  return key.split("#")[1];
};

export const toHHMMSS = (seconds: number): string => {
  return match({ seconds })
    .with({ seconds: 0 }, () => "--")
    .with({ seconds: P.when((val) => val < 600) }, () =>
      new Date(seconds * 1000).toISOString().substring(15, 19)
    )
    .with({ seconds: P.when((val) => val < 3600) }, () =>
      new Date(seconds * 1000).toISOString().substring(14, 19)
    )
    .otherwise(({ seconds }) =>
      new Date(seconds * 1000).toISOString().substring(11, 16)
    );
};

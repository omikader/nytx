export const START = "2023-05-21";
export const ZONE = "America/New_York";

export const parseKey = (key: string): string => {
  return key.split("#")[1];
};

export const toHHMMSS = (seconds: number): string => {
  if (seconds === 0) {
    return "--";
  }

  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.round(seconds % 60);

  return [h, m > 9 ? m : h ? "0" + m : m || "0", s > 9 ? s : "0" + s]
    .filter(Boolean)
    .join(":");
};

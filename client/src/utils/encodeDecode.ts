export const decodeBase64 = (str: string | null) => {
  if (str === null) {
    return null;
  }
  return parseInt(atob(str), 10);
};

export const encodeBase64 = (
  value: string | number | undefined | null
): string => {
  return btoa(value?.toString() || "");
};

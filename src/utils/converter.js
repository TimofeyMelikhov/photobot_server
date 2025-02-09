export const convertBigIntToString = (obj) => {
  if (!obj || typeof obj !== "object") return obj;

  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [
      key,
      typeof value === "bigint" ? value.toString() : value,
    ])
  );
};

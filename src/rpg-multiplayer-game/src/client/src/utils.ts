// export const objectMap = (obj: { [key: string]: unknown }, func: (v: unknown) => unknown) => {
export const objectMap = (obj, func) => {
  return Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, func(v)]));
};

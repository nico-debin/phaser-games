export const omit = (obj: { [key: string]: unknown }, omitKey: string[]) => {
  return Object.keys(obj).reduce((result, key) => {
    if(!omitKey.includes(key)) {
       result[key] = obj[key];
    }
    return result;
  }, {});  
};

// export const objectMap = (obj: { [key: string]: unknown }, func: (v: unknown) => unknown) => {
export const objectMap = (obj, func) => {
  return Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, func(v)]));
}
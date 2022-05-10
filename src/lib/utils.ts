export const isSSR = typeof window === "undefined";
export const checkNull = (val: any) => val === null || val === undefined; 
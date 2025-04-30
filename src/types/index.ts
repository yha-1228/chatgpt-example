// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AsyncFunc = (...args: any[]) => Promise<any>;

export type Replace<T, U extends { [key in keyof T]?: unknown }> = Omit<
  T,
  keyof U
> &
  U;

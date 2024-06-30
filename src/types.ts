export type Awaitable<T> = T | Promise<T>;

// https://stackoverflow.com/a/52703444
export type PartialPick<T, R extends keyof T> = Partial<T> & Pick<T, R>;

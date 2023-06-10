export const isAllDefinedOrUndefined = <T, K extends keyof T>
  (obj: T): Record<K, NonNullable<T[K]>> | undefined => (
    Object.values(obj as Object).reduce((acc, v) => acc + (v === undefined ? 1 : 0), 0)
      % Object.keys(obj as Object).length
  ) === 0 ? obj as Record<K, NonNullable<T[K]>> : undefined

export const isAllDefined = <
  T extends Record<string, T[keyof T]> | ArrayLike<T>
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
>(obj: T) => Object.values(obj).every((v) => v !== undefined)
    ? obj as Record<keyof T, NonNullable<T[keyof T]>>
    : undefined

export const isAllUndefined = <
T extends Record<string, T[keyof T]> | ArrayLike<T>
// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
>(obj: T) => Object.values(obj).every((v) => v === undefined)

export type Ok<T> = { 
    ok: T
}

export type Err<T> = {
    err: T
}

export type Result<T, U> = Ok<T> | Err<U>

export const isOk = <T>(r: Result<T, any>): r is Ok<T> => r.hasOwnProperty('ok')

export const isErr = <T>(r: Result<any, T>): r is Err<T> => r.hasOwnProperty('err')

export const isAllOk = <T extends string | number | symbol, U extends Result<unknown, unknown>>(o: Record<T, U>) => {
    return Object.values<any>(o).every(v => isOk(v))
}

export const wrapAsync = <T, E = unknown>(op: () => Promise<T>): Promise<Result<T, E>> => {
    try {
        return op()
            .then((v) => ({ ok: v }))
            .catch((e) => ({ err: e }))
    } catch (e) {
        return Promise.resolve({ err: e as E });
    }
}

export const wrap = <T, E = unknown>(op: () => T): Result<T, E> => {
    try {
        return { ok: op() }
    } catch (e) {
        return { err: (e as E) }
    }
}

export const unwrap = <T, U>(r: Result<T, U>) => isOk(r) ? r.ok : new Error(`Tried to unwrap Err: ${r.err}`);

export const unwrapOr = <T, U>(result: Result<U, unknown>, or: T) => {
    if(isOk(result)) return result.ok
    return or
}

export const toString = <T, U>(r: Result<T, U>) => isOk(r) ? `Ok(${r})`: `Err(${r})`
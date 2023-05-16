export const enum ResultKind {
    Ok = 0,
    Err = 1,
}

export type Ok<T> = {
    kind: ResultKind.Ok;
    value: T;
}

export type Err<E> = {
    kind: ResultKind.Err;
    error: E;
}

export type Result<T, E> = Ok<T> | Err<E>;

export function Ok<T>(value: T): Ok<T> {
    return { kind: ResultKind.Ok, value };
}

export function Err<E>(error: E): Err<E> {
    return { kind: ResultKind.Err, error };
}

export const Result = Object.freeze({
    Ok,
    Err,
});

export function isOk<T, E>(result: Result<T, E>): result is Ok<T> {
    return result.kind === ResultKind.Ok;
}

export function isErr<T, E>(result: Result<T, E>): result is Err<E> {
    return result.kind === ResultKind.Err;
}

export function mapOkResult<T, E, U>(result: Result<T, E>, fn: (value: T) => U): Result<U, E> {
    return isOk(result) ? Ok(fn(result.value)) : result;
}

export function mapErrResult<T, E, F>(result: Result<T, E>, fn: (error: E) => F): Result<T, F> {
    return isErr(result) ? Err(fn(result.error)) : result;
}

export function mapResult<T, E, U, F>(result: Result<T, E>, fnOk: (value: T) => U, fnErr: (error: E) => F): Result<U, F> {
    return isOk(result) ? Ok(fnOk(result.value)) : Err(fnErr(result.error));
}

export function andThenResult<T, E, U>(result: Result<T, E>, fn: (value: T) => Result<U, E>): Result<U, E> {
    return isOk(result) ? fn(result.value) : result;
}

export function orElseResult<T, E, F>(result: Result<T, E>, fn: (error: E) => Result<T, F>): Result<T, F> {
    return isErr(result) ? fn(result.error) : result;
}

export function unwrapResult<T, E>(result: Result<T, E>): T {
    if (isOk(result)) {
        return result.value;
    } else {
        throw result.error;
    }
}

export function unwrapOrResult<T, E>(result: Result<T, E>, defaultValue: T): T {
    return isOk(result) ? result.value : defaultValue;
}

export function unwrapOrElseResult<T, E>(result: Result<T, E>, fn: (error: E) => T): T {
    return isOk(result) ? result.value : fn(result.error);
}

export function expectResult<T, E>(result: Result<T, E>, message: string): T {
    if (isOk(result)) {
        return result.value;
    } else {
        throw new Error(message);
    }
}

export const enum OptionKind {
    Some = 0,
    None = 1,
}

export type Some<T> = {
    kind: OptionKind.Some;
    value: T;
}

export type None = {
    kind: OptionKind.None;
}

export type Option<T> = Some<T> | None;

export function Some<T>(value: T): Some<T> {
    return { kind: OptionKind.Some, value };
}

export const None = Object.freeze({ kind: OptionKind.None });

export const Option = Object.freeze({
    Some,
    None,
});

export function isSome<T>(option: Option<T>): option is Some<T> {
    return option.kind === OptionKind.Some;
}

export function isNone<T>(option: Option<T>): option is None {
    return option.kind === OptionKind.None;
}

export function mapOption<T, U>(option: Option<T>, fn: (value: T) => U): Option<U> {
    return isSome(option) ? Some(fn(option.value)) : None;
}

export function andThenOption<T, U>(option: Option<T>, fn: (value: T) => Option<U>): Option<U> {
    return isSome(option) ? fn(option.value) : None;
}

export function unwrapOption<T>(option: Option<T>): T {
    if (isSome(option)) {
        return option.value;
    } else {
        throw new Error("unwrapOption called on None");
    }
}

export function unwrapOrElseOption<T>(option: Option<T>, fn: () => T): T {
    return isSome(option) ? option.value : fn();
}

export async function unwrapOrElseAsyncOption<T>(option: Option<T>, fn: () => Promise<T>): Promise<T> {
    return isSome(option) ? option.value : fn();
}

export function expectOption<T>(option: Option<T>, message: string): T {
    if (isSome(option)) {
        return option.value;
    } else {
        throw new Error(message);
    }
}

export function okResult<T, E>(result: Result<T, E>): Option<T> {
    return isOk(result) ? Some(result.value) : None;
}

export function errResult<T, E>(result: Result<T, E>): Option<E> {
    return isErr(result) ? Some(result.error) : None;
}

export function okOrOption<T, E>(option: Option<T>, error: E): Result<T, E> {
    return isSome(option) ? Ok(unwrapOption(option)) : Err(error);
}

export function okOrElseOption<T, E>(option: Option<T>, fn: () => T): Result<T, E> {
    return isSome(option) ? Ok(unwrapOption(option)) : Ok(fn());
}

export function wrapOption<T>(value: T | null | undefined): Option<T> {
    return value == null ? None : Some(value);
}

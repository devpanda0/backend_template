import path from "path"

/**
 * Create an environment where path.normalize() will use unix style paths, even on windows.
 *
 * This is useful for typeorm which internally uses path.normalize on globs, but the package "glob" only works with unix style paths.
 *
 * @param fn - The function to execute with the environment.
 * @returns The normalized path.
 */
export async function normalizeWithUnixPaths<T>(fn: () => Promise<T> | T): Promise<T> {
    const orig = path.normalize
    path.normalize = (p: string) => orig(p).replaceAll("\\", "/")
    try {
        const fRet = await fn()
        path.normalize = orig

        return fRet
    } catch (e: unknown) {
        path.normalize = orig
        throw e
    }
}

export function getErrorMessage(
  error: unknown,
  fallback: string = 'Unknown Error',
) {
  if (typeof error === 'string') return error
  if (error instanceof Error) return error.message
  return fallback
}

/**
 * Executes a promise and catches specific types of errors.
 * If an error of the specified types is thrown, it returns the error.
 * Otherwise, it rethrows the error.
 *
 * @template T - The type of the resolved value of the promise.
 * @template E - The type of the error constructor to catch.
 *
 * @param {Promise<T>} promise - The promise to execute.
 * @param {E[]} [errorsToCatch] - An array of error constructors to catch.
 *
 * @returns {Promise<[undefined, T] | [InstanceType<E>]>}
 * A promise that resolves to a tuple. The first element is `undefined` if
 * the promise resolves successfully, or the caught error if an error of
 * the specified types was thrown. The second element is the resolved value
 * if the promise was successful.
 *
 * @example
 * class CustomError extends Error {
 *   name = 'CustomError';
 *   extraProp = 'ERROR: this error';
 * }
 *
 * const [error, user] = await catchErrorTyped(getUser(1), [CustomError]);
 */
export function catchErrorTyped<T, E extends new (message?: string) => Error>(
  promise: Promise<T>,
  errorsToCatch?: E[],
): Promise<[undefined, T] | [InstanceType<E>]> {
  return promise
    .then(data => {
      return [undefined, data] as [undefined, T]
    })
    .catch(error => {
      if (errorsToCatch == null) {
        return [error]
      }
      if (errorsToCatch.some(e => error instanceof e)) {
        return [error]
      }

      throw error
    })
}

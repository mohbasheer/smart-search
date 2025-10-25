/**
 *
 * @param func The function to debounce.
 * @param wait The number of milliseconds to delay.
 * @returns A new debounced function.
 */
export const debounce = <T extends (...args: any[]) => void>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: number;

  return function (this: any, ...args: Parameters<T>): void {
    clearTimeout(timeout);

    timeout = window.setTimeout(() => {
      func.apply(this, args);
    }, wait);
  };
};

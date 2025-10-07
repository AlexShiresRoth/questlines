import { trim } from 'validator';

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 *
 * @param input payload object
 * @desc - this doesn't necessarily fully sanitize an input but trims extra space
 * everything is being saved as a string so not a need to sanitize really
 * @returns
 */
export function sanitizePayload<T extends Record<string, unknown>>(input: T) {
  if (!isPlainObject(input)) {
    return input;
  }

  const inputCopy: Record<string, unknown> = { ...input };

  for (const [key, value] of Object.entries(inputCopy)) {
    // basic clean up
    if (typeof value === 'string') {
      inputCopy[key] = trim(value);
    }
    // Currently we only have array of strings or objects with string values
    if (Array.isArray(value)) {
      inputCopy[key] = value.map((val) => {
        if (isPlainObject(val)) {
          const obj: { [key: string]: string | unknown } = {};

          Object.entries(val).forEach(([k, v]) => {
            obj[k as string] = typeof v === 'string' ? trim(v as string) : v;
          });

          return obj;
        } else {
          return trim(val);
        }
      });
    }
  }

  return inputCopy as T;
}

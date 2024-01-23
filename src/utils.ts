import type { z } from 'zod';

export class ValidationError extends Error {
  code: string;

  constructor(code: string, message: string) {
    super(message);
    this.code = code;
  }
}

export const isEmpty = (obj: object | Record<string, never>) => {
  return Object.keys(obj).length === 0;
};

// Thanks Matt Pocok!!!
// https://www.youtube.com/watch?v=dLPgQRbVquo
export async function zodFetch<TData>(
  url: string | URL,
  schema: z.Schema<TData>
): Promise<TData> {
  return fetch(url)
    .then((res) => res.json())
    .then((res) => {
      return schema.parse(res);
    })
    .catch((err) => {
      if (err instanceof SyntaxError) {
        throw new ValidationError('parse_failure', 'JSON Body could not be parsed');
      } else {
        throw err;
      }
    });
}

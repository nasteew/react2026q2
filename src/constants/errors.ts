export const ERROR_CODES = {
  POKEMON_NOT_FOUND: 'POKEMON_NOT_FOUND',
  BAD_REQUEST: 'BAD_REQUEST',
  SERVER_ERROR: 'SERVER_ERROR',
} as const;

export type ErrorCode = keyof typeof ERROR_CODES;

export const errorMap: Record<ErrorCode, string> = {
  POKEMON_NOT_FOUND: 'notFoundItem',
  BAD_REQUEST: 'badRequest',
  SERVER_ERROR: 'somethingWrong',
};

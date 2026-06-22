import type { ErrorCode } from '@/constants/errors';

export class ApiError extends Error {
  constructor(public code: ErrorCode) {
    super(code);
  }
}

import { errorMap } from '@/constants/errors';
import { ApiError } from '@/api/errors';

type TFn = (key: string) => string;

export function getErrorMessage(error: unknown, t: TFn) {
  if (error instanceof ApiError) {
    return t(`${errorMap[error.code]}`);
  }

  return t('somethingWrong');
}

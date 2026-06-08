import { z } from 'zod';
import { validateCountry } from '@/utils/validateCountry';
import {
  passwordHasLowercase,
  passwordHasNumber,
  passwordHasSpecial,
  passwordHasUppercase,
} from '@/utils/passwordStrength';

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ['image/png', 'image/jpeg'];

const emailSchema = z.string().superRefine((val, ctx) => {
  const parts = val.split('@');

  if (parts.length !== 2) {
    ctx.addIssue({
      code: 'custom',
      message: 'Email must contain exactly one @',
    });
    return;
  }

  const [local, domain] = parts;

  if (!local) {
    ctx.addIssue({
      code: 'custom',
      message: 'Email local part cannot be empty',
    });
    return;
  }

  if (!domain || !domain.includes('.')) {
    ctx.addIssue({
      code: 'custom',
      message: 'Email domain must contain at least one dot',
    });
    return;
  }

  const afterDot = domain.split('.')[1];
  if (!afterDot) {
    ctx.addIssue({
      code: 'custom',
      message: 'Email domain extension cannot be empty',
    });
  }
});

const imageSchema = z
  .custom<File | FileList | null>(
    (val) => val === null || val instanceof File || val instanceof FileList,
    { message: 'Invalid image input' }
  )
  .superRefine((val, ctx) => {
    const file: File | null =
      val instanceof FileList
        ? (val[0] ?? null)
        : val instanceof File
          ? val
          : null;

    if (!file) {
      ctx.addIssue({ code: 'custom', message: 'Image is required' });
      return;
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      ctx.addIssue({
        code: 'custom',
        message: 'Only PNG and JPEG files are allowed',
      });
    }

    if (file.size > MAX_FILE_SIZE) {
      ctx.addIssue({
        code: 'custom',
        message: 'File size must not exceed 5MB',
      });
    }
  });

export function createFormSchema(countries: string[]) {
  return z
    .object({
      name: z
        .string()
        .min(1, 'Name is required')
        .refine(
          (val) => val.length > 0 && val[0] === val[0].toUpperCase(),
          'First letter must be uppercase'
        ),

      age: z
        .number()
        .refine((v) => !Number.isNaN(v), { message: 'Age must be a number' })
        .int('Age must be a whole number')
        .nonnegative('Age cannot be negative')
        .max(120, 'Age seems too high'),

      email: emailSchema,

      gender: z.enum(['male', 'female'], {
        message: 'Please select a gender',
      }),

      password: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .refine(passwordHasNumber, 'Must contain at least 1 number')
        .refine(
          passwordHasUppercase,
          'Must contain at least 1 uppercase letter'
        )
        .refine(
          passwordHasLowercase,
          'Must contain at least 1 lowercase letter'
        )
        .refine(
          passwordHasSpecial,
          'Must contain at least 1 special character'
        ),

      confirmPassword: z.string().min(1, 'Please confirm your password'),

      country: z
        .string()
        .min(1, 'Country is required')
        .superRefine((val, ctx) => {
          const error = validateCountry(val, countries);
          if (error) {
            ctx.addIssue({ code: 'custom', message: error });
          }
        }),

      terms: z.boolean().refine((v) => v === true, {
        message: 'You must accept the Terms & Conditions',
      }),

      image: imageSchema,
    })
    .superRefine((data, ctx) => {
      if (data.password !== data.confirmPassword) {
        ctx.addIssue({
          code: 'custom',
          message: 'Passwords do not match',
          path: ['confirmPassword'],
        });
      }
    });
}

export type FormValues = z.infer<ReturnType<typeof createFormSchema>>;

export type FormFieldValues = z.input<ReturnType<typeof createFormSchema>>;

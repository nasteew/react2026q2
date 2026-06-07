import { type JSX, useMemo } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createFormSchema, type FormValues } from '@/schemas/schema';
import { getPasswordStrength } from '@/utils/passwordStrength';
import { toBase64 } from '@/utils/toBase64';
import { addSubmission } from '@/store/submissionsSlice';
import { useAppDispatch, useAppSelector, selectCountries } from '@/store/hooks';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

import { PasswordStrength } from '@/components/PasswordStrength/PasswordStrength';
import { CountryField } from '@/components/CountryField/CountryField';
import { FileUpload } from '@/components/FileUpload/FileUpload';
import { TermsCheckbox } from '@/components/TermsCheckbox/TermsCheckbox';
import { GenderField } from '@/components/GenderField/GenderField';

interface Props {
  onClose: (id: string) => void;
}

export function RHFForm({ onClose }: Props): JSX.Element {
  const dispatch = useAppDispatch();
  const countries = useAppSelector(selectCountries);
  const schema = useMemo(() => createFormSchema(countries), [countries]);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
    mode: 'onChange',
  });

  const passwordValue = useWatch({ control, name: 'password' }) ?? '';
  const strength = passwordValue ? getPasswordStrength(passwordValue) : null;

  const onSubmit = async (data: FormValues) => {
    const file =
      data.image instanceof FileList
        ? data.image[0]
        : data.image instanceof File
          ? data.image
          : undefined;
    const image = file ? await toBase64(file) : '';

    const {
      name,
      age,
      email,
      gender,
      password,
      confirmPassword,
      country,
      terms,
    } = data;
    const action = dispatch(
      addSubmission({
        name,
        age,
        email,
        gender,
        password,
        confirmPassword,
        country,
        terms,
        image,
      })
    );
    reset();
    onClose(action.payload.id);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="flex flex-col gap-3"
    >
      <Input
        id="rhf-name"
        label="Full name"
        placeholder="Ada Lovelace"
        error={errors.name?.message}
        {...register('name')}
      />

      <Input
        id="rhf-age"
        type="number"
        min={0}
        label="Age"
        placeholder="25"
        error={errors.age?.message}
        {...register('age', { valueAsNumber: true })}
      />

      <GenderField
        id="rhf-gender"
        error={errors.gender?.message}
        {...register('gender')}
      />

      <Input
        id="rhf-email"
        type="email"
        label="Email"
        placeholder="ada@example.com"
        error={errors.email?.message}
        {...register('email')}
      />

      <Input
        id="rhf-password"
        type="password"
        label="Password"
        placeholder="••••••••"
        error={errors.password?.message}
        {...register('password')}
      />

      <PasswordStrength strength={strength} />

      <Input
        id="rhf-confirm"
        type="password"
        label="Confirm password"
        placeholder="••••••••"
        error={errors.confirmPassword?.message}
        {...register('confirmPassword')}
      />

      <CountryField
        id="rhf-country"
        error={errors.country?.message}
        countries={countries}
        {...register('country')}
      />

      <FileUpload
        id="rhf-image"
        error={errors.image?.message}
        {...register('image')}
      />

      <TermsCheckbox
        id="rhf-terms"
        error={errors.terms?.message}
        {...register('terms')}
      />

      <Button type="submit" disabled={!isValid} className="mt-1 w-full py-3.5">
        Submit
      </Button>
    </form>
  );
}

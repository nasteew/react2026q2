import { type JSX, useMemo, useState } from 'react';
import { createFormSchema } from '@/schemas/schema';
import {
  getPasswordStrength,
  type PasswordStrength as PasswordStrengthType,
} from '@/utils/passwordStrength';
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

export function UncontrolledForm({ onClose }: Props): JSX.Element {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [strength, setStrength] = useState<PasswordStrengthType | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const dispatch = useAppDispatch();
  const countries = useAppSelector(selectCountries);
  const formSchema = useMemo(() => createFormSchema(countries), [countries]);

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;

    const formData = new FormData(form);

    const imageEntry = formData.get('image');
    const file =
      imageEntry instanceof File && imageEntry.size > 0
        ? imageEntry
        : imageFile;

    const rawData = {
      name: formData.get('name') as string,
      age: (formData.get('age') as string) ?? '',
      email: formData.get('email') as string,
      gender: formData.get('gender') as string,
      password: formData.get('password') as string,
      confirmPassword: formData.get('confirmPassword') as string,
      country: formData.get('country') as string,
      terms: formData.get('terms') !== null,
      image: file,
    };

    const result = formSchema.safeParse(rawData);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};

      for (const issue of result.error.issues) {
        const field = issue.path[0];
        if (typeof field === 'string' && !fieldErrors[field]) {
          fieldErrors[field] = issue.message;
        }
      }

      setErrors(fieldErrors);
      return;
    }

    const image = rawData.image ? await toBase64(rawData.image) : '';

    const {
      name,
      age,
      email,
      gender,
      password,
      confirmPassword,
      country,
      terms,
    } = result.data;
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

    form.reset();
    setErrors({});
    setStrength(null);
    setImageFile(null);

    onClose(action.payload.id);
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-3">
      <Input
        id="uc-name"
        name="name"
        label="Full name"
        placeholder="Ada Lovelace"
        error={errors.name}
      />

      <Input
        id="uc-age"
        name="age"
        type="text"
        inputMode="numeric"
        label="Age"
        placeholder="25"
        error={errors.age}
      />

      <GenderField id="uc-gender" name="gender" error={errors.gender} />

      <Input
        id="uc-email"
        name="email"
        type="email"
        label="Email"
        placeholder="ada@example.com"
        error={errors.email}
      />

      <Input
        id="uc-password"
        name="password"
        type="password"
        label="Password"
        placeholder="••••••••"
        error={errors.password}
        onChange={(e) => setStrength(getPasswordStrength(e.target.value))}
      />

      <PasswordStrength strength={strength} />

      <Input
        id="uc-confirm"
        name="confirmPassword"
        type="password"
        label="Confirm password"
        placeholder="••••••••"
        error={errors.confirmPassword}
      />

      <CountryField
        id="uc-country"
        name="country"
        countries={countries}
        error={errors.country}
      />

      <FileUpload
        id="uc-image"
        name="image"
        error={errors.image}
        onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
      />

      <TermsCheckbox id="uc-terms" name="terms" error={errors.terms} />

      <Button type="submit" className="mt-1 w-full py-3.5">
        Submit
      </Button>
    </form>
  );
}

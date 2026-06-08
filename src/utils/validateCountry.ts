export function validateCountry(
  country: string,
  countries: string[]
): string | null {
  if (!countries.includes(country)) {
    return 'Country must be selected from the list';
  }
  return null;
}

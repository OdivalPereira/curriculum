export function getLocalizedField<T extends Record<string, any>>(
  record: T,
  fieldBase: string,
  lng: string
): string {
  const language = lng || 'pt';
  const localizedKey = `${fieldBase}_${language}`;
  const fallbackKey = `${fieldBase}_pt`;

  const value = record[localizedKey];

  if (value && typeof value === 'string' && value.trim() !== '') {
    return value;
  }

  const fallbackValue = record[fallbackKey];
  if (fallbackValue && typeof fallbackValue === 'string') {
    return fallbackValue;
  }

  return '';
}

export const onlyDigits = (value: string): string => value.replace(/\D/g, '');

/** Aceita "(19) 99999-9999" ou "5519999999999" e devolve sempre com DDI 55. */
export function normalizeBrPhone(value: string): string {
  const digits = onlyDigits(value);
  if (digits.length === 10 || digits.length === 11) return `55${digits}`;
  return digits;
}

export function whatsappLink(number: string, text?: string): string {
  const phone = normalizeBrPhone(number);
  const query = text ? `?text=${encodeURIComponent(text)}` : '';
  return `https://wa.me/${phone}${query}`;
}

export function instagramLink(user: string): string {
  return `https://instagram.com/${user.replace(/^@/, '').trim()}`;
}

export function instagramHandle(user: string): string {
  const clean = user.replace(/^@/, '').trim();
  return clean ? `@${clean}` : '';
}

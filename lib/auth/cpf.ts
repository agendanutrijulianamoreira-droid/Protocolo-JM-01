// Remove tudo que não for dígito.
export function normalizeCpf(cpf: string): string {
  return cpf.replace(/\D/g, "");
}

// Valida os dígitos verificadores do CPF (algoritmo padrão da Receita Federal).
export function isValidCpf(cpf: string): boolean {
  const digits = normalizeCpf(cpf);

  if (digits.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(digits)) return false; // todos os dígitos iguais

  const calcCheckDigit = (base: string) => {
    let sum = 0;
    let weight = base.length + 1;
    for (const char of base) {
      sum += Number(char) * weight;
      weight -= 1;
    }
    const remainder = sum % 11;
    return remainder < 2 ? 0 : 11 - remainder;
  };

  const firstNine = digits.slice(0, 9);
  const firstCheck = calcCheckDigit(firstNine);
  const firstTen = firstNine + firstCheck;
  const secondCheck = calcCheckDigit(firstTen);

  return digits === firstTen + secondCheck;
}

export function lastDigits(cpf: string, count = 3): string {
  const digits = normalizeCpf(cpf);
  return digits.slice(-count);
}

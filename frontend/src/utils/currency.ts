export function formatMoney(amountMinorUnits: number, currencyCode: string): string {
  if (isNaN(amountMinorUnits) || typeof amountMinorUnits !== 'number') {
    return String(amountMinorUnits);
  }

  const zeroDecimalCurrencies = new Set([
    'BIF', 'CLP', 'DJF', 'GNF', 'JPY', 'KMF', 'KRW', 'MGA',
    'PYG', 'RWF', 'UGX', 'VND', 'VUV', 'XAF', 'XOF', 'XPF'
  ]);
  const threeDecimalCurrencies = new Set([
    'BHD', 'IQD', 'JOD', 'KWD', 'LYD', 'OMR', 'TND'
  ]);

  let divisor = 100;
  if (zeroDecimalCurrencies.has(currencyCode.toUpperCase())) {
    divisor = 1;
  } else if (threeDecimalCurrencies.has(currencyCode.toUpperCase())) {
    divisor = 1000;
  }

  const majorUnits = amountMinorUnits / divisor;

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
  }).format(majorUnits);
}

/**
 * ADAPTER: API Major Unit to Canonical Minor Unit
 * The current backend API contract temporarily returns string/number decimal values (e.g. "49.99").
 * This helper isolates the transformation into the frontend's strict minor-unit model.
 *
 * E.g., adaptMajorToMinor("49.99", "USD") -> 4999
 */
export function adaptMajorToMinor(amountMajor: string | number, currencyCode: string): number {
  if (!amountMajor && amountMajor !== 0) return 0;
  const val = typeof amountMajor === 'string' ? parseFloat(amountMajor) : amountMajor;
  if (isNaN(val)) return 0;

  const zeroDecimalCurrencies = new Set([
    'BIF', 'CLP', 'DJF', 'GNF', 'JPY', 'KMF', 'KRW', 'MGA',
    'PYG', 'RWF', 'UGX', 'VND', 'VUV', 'XAF', 'XOF', 'XPF'
  ]);
  const threeDecimalCurrencies = new Set([
    'BHD', 'IQD', 'JOD', 'KWD', 'LYD', 'OMR', 'TND'
  ]);

  let multiplier = 100;
  if (zeroDecimalCurrencies.has(currencyCode.toUpperCase())) {
    multiplier = 1;
  } else if (threeDecimalCurrencies.has(currencyCode.toUpperCase())) {
    multiplier = 1000;
  }

  // Use Math.round to avoid JS floating point errors (e.g. 49.99 * 100 = 4998.999999999999)
  return Math.round(val * multiplier);
}

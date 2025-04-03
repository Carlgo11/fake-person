import { Sex } from "../index.js";

// The three supported options.
const options = ['Personnummer', 'Samordningsnummer', 'TFnummer'];

/**
 * Generates a Swedish civic number (either a Personnummer, Samordningsnummer, or TFnummer)
 * based on the given birthday and sex. Only the generated civic number string is returned.
 *
 * @param birthday The person's birthday.
 * @param sex The person's sex ("male" or "female").
 * @returns A Promise resolving to a generated civic number string.
 */
export default async function generateCivicNo(birthday: Date, sex: Sex): Promise<string> {
  // Pick a random option.
  const option = options[Math.floor(Math.random() * options.length)];
  switch (option) {
    case 'Personnummer':
      return generateSwedishPersonnummer(birthday, sex);
    case 'Samordningsnummer':
      return generateSwedishSamordningsnummer(birthday, sex);
    case 'TFnummer':
      return generateTFnummer(birthday, sex);
    default:
      throw new Error("Unsupported option");
  }
}

/**
 * Generates a valid Swedish Personnummer.
 * Format: YYYYMMDDNNNC, where NNC is a three-digit serial with the last digit encoding gender,
 * and C is the Luhn check digit computed on the 9-digit short form (YYMMDDNNN).
 */
function generateSwedishPersonnummer(birthday: Date, sex: Sex): string {
  const yearFull = birthday.getFullYear();
  const month = ('0' + (birthday.getMonth() + 1)).slice(-2);
  const day = ('0' + birthday.getDate()).slice(-2);
  const base = `${yearFull}${month}${day}`;
  // Generate a random two-digit prefix for the serial part.
  const serialPrefix = String(Math.floor(Math.random() * 100)).padStart(2, '0');
  // Choose a gender digit: odd for male, even for female.
  const possibleGenderDigits = sex === 'male' ? [1, 3, 5, 7, 9] : [0, 2, 4, 6, 8];
  const genderDigit = possibleGenderDigits[Math.floor(Math.random() * possibleGenderDigits.length)];
  const serial = serialPrefix + genderDigit; // three-digit serial
  // Create short form: YYMMDD + serial.
  const shortForm = `${String(yearFull).slice(-2)}${month}${day}${serial}`;
  const checkDigit = computeLuhnCheckDigit(shortForm);
  return `${base}${serial}${checkDigit}`;
}

/**
 * Generates a valid Swedish Samordningsnummer.
 * Samordningsnummer is similar to Personnummer, except that the day is offset by 60.
 * Format: YYYYMM(Day+60)NNNC.
 */
function generateSwedishSamordningsnummer(birthday: Date, sex: Sex): string {
  const yearFull = birthday.getFullYear();
  const month = ('0' + (birthday.getMonth() + 1)).slice(-2);
  // Offset the day by 60.
  const actualDay = birthday.getDate();
  const dayOffset = actualDay + 60;
  const dayStr = ('0' + dayOffset).slice(-2);
  const base = `${yearFull}${month}${dayStr}`;
  const serialPrefix = String(Math.floor(Math.random() * 100)).padStart(2, '0');
  const possibleGenderDigits = sex === 'male' ? [1, 3, 5, 7, 9] : [0, 2, 4, 6, 8];
  const genderDigit = possibleGenderDigits[Math.floor(Math.random() * possibleGenderDigits.length)];
  const serial = serialPrefix + genderDigit;
  const shortForm = `${String(yearFull).slice(-2)}${month}${dayStr}${serial}`;
  const checkDigit = computeLuhnCheckDigit(shortForm);
  return `${base}${serial}${checkDigit}`;
}

/**
 * Generates a simple TFnummer.
 * For simplicity, we generate a TFnummer in the form YYYYMMDDTF10 for males and TF20 for females.
 */
function generateTFnummer(birthday: Date, sex: Sex): string {
  const yearFull = birthday.getFullYear();
  const month = ('0' + (birthday.getMonth() + 1)).slice(-2);
  const day = ('0' + birthday.getDate()).slice(-2);
  const suffix = sex === 'male' ? '10' : '20';
  return `${yearFull}${month}${day}TF${suffix}`;
}

/**
 * Computes the Luhn check digit for a numeric string.
 * Applies the Luhn algorithm to the input string of digits.
 */
function computeLuhnCheckDigit(digits: string): number {
  let sum = 0;
  for (let i = 0; i < digits.length; i++) {
    let digit = parseInt(digits[i], 10);
    // Double every other digit, starting at index 0.
    if (i % 2 === 0) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
  }
  return (10 - (sum % 10)) % 10;
}

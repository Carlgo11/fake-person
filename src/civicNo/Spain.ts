const options = ['DNI', 'NIE']

export default function generateCivicNo() {
  const option = options[Math.floor(Math.random() * options.length)];
  switch (option) {
    case 'DNI':
      return generateDNI();
    case 'NIE':
      return generateNIE();
  }
}

function generateDNI(): string {
  const numberPart = String(Math.floor(Math.random() * 100000000)).padStart(8, '0');
  const dniLetters = "TRWAGMYFPDXBNJZSQVHLCKE";
  const index = parseInt(numberPart, 10) % 23;
  const letter = dniLetters.charAt(index);
  return numberPart + letter;
}

function generateNIE(): string {
  // Only valid prefixes for NIE are "X", "Y", or "Z"
  const prefixLetters = "XYZ";
  const randomPrefix = prefixLetters.charAt(Math.floor(Math.random() * 3));

  // Convert prefix to its corresponding digit.
  let prefixDigit: string;
  switch (randomPrefix) {
    case "X":
      prefixDigit = "0";
      break;
    case "Y":
      prefixDigit = "1";
      break;
    case "Z":
      prefixDigit = "2";
      break;
    default:
      prefixDigit = "0";
  }

  // Generate a 7-digit number.
  const numberPart = String(Math.floor(Math.random() * 10000000)).padStart(7, '0');

  // Concatenate the converted prefix with the number part.
  const fullNumber = prefixDigit + numberPart;

  // Compute the checksum letter.
  const nieLetters = "TRWAGMYFPDXBNJZSQVHLCKE";
  const index = parseInt(fullNumber, 10) % 23;
  const letter = nieLetters.charAt(index);

  return randomPrefix + numberPart + letter;
}

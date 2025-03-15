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
  const prefixLetters = "XYZM"; // Possible prefix letters for NIE
  const randomPrefix = prefixLetters.charAt(Math.floor(Math.random() * 3)); // Select a random prefix (X, Y, or Z)
  const numberPart = String(Math.floor(Math.random() * 10000000)).padStart(7, '0'); // 7-digit number
  const nieLetters = "TRWAGMYFPDXBNJZSQVHLCKE"; // Letters used for validation
  const index = parseInt(numberPart, 10) % 23; // The same modulus operation as DNI
  const letter = nieLetters.charAt(index); // Checksum letter
  return randomPrefix + numberPart + letter;
}
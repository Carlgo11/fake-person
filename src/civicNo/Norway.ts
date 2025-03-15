const options = ['Fodselsnummer', 'DNummer']

export default async function generateCivicNo(birthday: Date, sex: 'male' | 'female') {
  const option = options[Math.floor(Math.random() * options.length)];
  switch (option) {
    case 'Fodselsnummer':
      return generateFodselsnummer(birthday, sex);
    case 'DNummer':
      break;
  }
}

function generateFodselsnummer(birthDate: Date, gender: "male" | "female"): string {
  const day = String(birthDate.getDate()).padStart(2, '0');
  const month = String(birthDate.getMonth() + 1).padStart(2, '0');
  const year = String(birthDate.getFullYear()).slice(-2);
  const datePart = `${day}${month}${year}`; // DDMMYY

  let fodselsnummer: string | undefined;
  for (let attempt = 0; attempt < 1000; attempt++) {
    // Generate an individual number between 000 and 499 with the correct gender.
    let individualNumber: number;
    do {
      individualNumber = Math.floor(Math.random() * 500);
    } while (
      (gender === "male" && individualNumber % 2 === 0) ||
      (gender === "female" && individualNumber % 2 === 1)
      );
    const individual = String(individualNumber).padStart(3, '0');
    const first9 = datePart + individual; // first 9 digits

    // Compute the first check digit using weights [3,7,6,1,8,9,4,5,2].
    const weights1 = [3, 7, 6, 1, 8, 9, 4, 5, 2];
    let sum1 = 0;
    for (let i = 0; i < 9; i++) {
      sum1 += parseInt(first9[i], 10) * weights1[i];
    }
    const remainder1 = sum1 % 11;
    let k1 = remainder1 === 0 ? 0 : 11 - remainder1;
    if (k1 === 11) k1 = 0;
    if (k1 === 10) continue; // invalid, try a different individual number

    // Compute the second check digit using weights [5,4,3,2,7,6,5,4,3,2].
    const first10 = first9 + k1.toString();
    const weights2 = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];
    let sum2 = 0;
    for (let i = 0; i < 10; i++) {
      sum2 += parseInt(first10[i], 10) * weights2[i];
    }
    const remainder2 = sum2 % 11;
    let k2 = remainder2 === 0 ? 0 : 11 - remainder2;
    if (k2 === 11) k2 = 0;
    if (k2 === 10) continue; // invalid, try again

    fodselsnummer = first9 + k1.toString() + k2.toString();
    break;
  }
  if (!fodselsnummer) {
    throw new Error("Unable to generate valid Norwegian fødselsnummer");
  }
  return fodselsnummer;
}
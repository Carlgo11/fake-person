import {Sex} from "../index.js";

const options = ['Personnummer', 'Samordningsnummer', 'TFnummer']

export default async function generateCivicNo(birthday: Date, sex: Sex): Promise<{
  civicNo: string;
  birthDate: Date
} | undefined> {
  const option = options[Math.floor(Math.random() * options.length)];
  const [year, month, day] = [
    birthday.getFullYear(),
    ('0' + (birthday.getMonth() + 1)).slice(-2), // Adding leading zero to month
    ('0' + birthday.getDate()).slice(-2), // Adding leading zero to day
  ];
  const _sex = sex === 'male' ? 1 : 0

  switch (option) {
    case 'Personnummer':
      return (await fetchPN(`^${year}${month}${day}\\d*$`, _sex))[0] ||
        (await fetchPN(`^${year}${month}\\d*$`,_sex))[0] ||
        (await fetchPN(`^${year}\\d*$`, _sex))[0]

    case 'Samordningsnummer':
      return (await fetchSN(`^${year}${month}\\d*$`,_sex))[0] ||
        (await fetchSN(`^${year}\\d*$`, _sex))[0]

    case 'TFnummer':
      return {
        birthDate: birthday,
        civicNo: `${year}${month}${day}TF${+!_sex + 1}${Math.floor(Math.random() * 10)}`,
      }
  }

  return undefined; // Return undefined if no result found
}


async function fetchPN(query: string, sex: 0 | 1) {
  let res: { civicNo: string, birthDate: Date }[] = [];
  const base = 'https://skatteverket.entryscape.net/rowstore/dataset/b4de7df7-63c0-4e7e-bb59-1f156a591763'
  const req = await fetch(`${base}?testpersonnummer=${query}`, {
    method: 'GET',
    headers: {
      accept: 'application/json',
    }
  })

  const data = await req.json();
  if (data && data.resultCount) {
    data.results.map(async (result: { 'testpersonnummer': string }) => {
      const civicNo = result['testpersonnummer'];
      const match = civicNo.match(/^(\d{4})(\d{2})(\d{2})/) as RegExpMatchArray;
      const [_, year, month, day] = match;
      const birthDate = new Date(`${year}-${month}-${day} 00:00:00`)
      if (parseInt(civicNo[10]) % 2 === sex) res.push({civicNo, birthDate})
    })
  }
  return res;
}

async function fetchSN(query: string, sex: 0|1) {
  let res: { civicNo: string, birthDate: Date }[] = [];
  const base = 'https://skatteverket.entryscape.net/rowstore/dataset/9f29fe09-4dbc-4d2f-848f-7cffdd075383'
  const req = await fetch(`${base}?testsamordningsnummer=${query}`, {
    method: 'GET',
    headers: {
      accept: 'application/json',
    }
  })

  const data = await req.json();
  if (data && data.resultCount) {
    data.results.map(async (result: { 'testsamordningsnummer': string }) => {
      const civicNo = result['testsamordningsnummer'];
      const match = civicNo.match(/^(\d{4})(\d{2})(\d{2})/) as RegExpMatchArray;
      const [_, year, month, day] = match;
      const birthDate = new Date(`${year}-${month}-${parseInt(day) - 60} 00:00:00`)
      if (parseInt(civicNo[10]) % 2 === sex) res.push({civicNo, birthDate})
    })
  }
  return res;
}
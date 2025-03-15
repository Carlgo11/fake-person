import {allFakers} from "@faker-js/faker";
import SwedishCivicNo from './civicNo/Sweden.js';
import SpanishCivicNo from './civicNo/Spain.js';
import NorwegianCivicNo from './civicNo/Norway.js';

export interface Person {
  firstName: string;
  lastName: string;
  birthday: Date;
  address: { street: string, city: string, state: string, country: string };
  phone: string;
  email: string;
  civicNo?: string;
}

/**
 * Generates a fake person.
 *
 * The function generates random data, such as name, gender, birthday, etc.,
 * based on the specified language, country, and gender. The returned object contains
 * the generated data in a structured format.
 *
 * @param {Object} options - The options for generating the fake person.
 * @param {string} [options.lang='en'] - The language to use for generating person data. Default is 'en'.
 * @param {string} [options.country] - The country for the fake person. Determines region-specific data.
 * @param {'male'|'female'} [options.sex] - The biological gender of the person. Defaults to a random gender if not specified.
 *
 * @returns {Promise<Person>} A promise that resolves to an object representing the fake person.
 * @since 0.0.1
 * @see Person
 */
export default async function generateFakePerson({lang = 'en', country, sex: _sex}: {
  lang?: string,
  country: string,
  sex?: 'male' | 'female'
}): Promise<Person> {

  const faker = allFakers[lang as keyof typeof allFakers];

  // Set random sex if not defined
  const sex = _sex || faker.person.sex() as 'male' | 'female';

  const firstName = faker.person.firstName(sex)
  const lastName = faker.person.lastName(sex)

  const address = {
    street: faker.location.streetAddress(),
    city: faker.location.city(),
    state: faker.location.state(),
    country,
  }

  let birthday = faker.date.birthdate({min: 18, max: 100, mode: 'age'});
  const phone = faker.phone.number({style: 'international'});
  const email = faker.internet.email({firstName, lastName})
  let civicNo: string | undefined;

  switch (country) {
    case 'Sweden':
      let {civicNo: _civicNo, birthDate} = await SwedishCivicNo(birthday, sex) as { civicNo: string, birthDate: Date }
      civicNo = _civicNo
      birthday = birthDate
      break;
    case 'Spain':
      civicNo = SpanishCivicNo()
      break;
    case 'Norway':
      civicNo = await NorwegianCivicNo(birthday, sex);
      break;
    default:
      throw new Error('Unsupported country');
  }

  return {
    firstName,
    lastName,
    birthday,
    civicNo,
    phone,
    email,
    address,
  }
}

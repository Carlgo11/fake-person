import {allFakers} from "@faker-js/faker";
import SwedishCivicNo from './civicNo/Sweden.js';
import SpanishCivicNo from './civicNo/Spain.js';
import NorwegianCivicNo from './civicNo/Norway.js';

export interface Person {
  firstName: string;
  lastName: string;
  birthday: Date;
  address: Address;
  phone: string;
  email: string;
  civicNo?: string;
}

export interface Address {
  street: string,
  city: string,
  state: string,
  country: Countries
}

export type Countries = 'Sweden' | 'Norway' | 'Spain';
export type Sex = 'male' | 'female';

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
export default async function generateFakePerson({lang = 'en', country, sex: _sex, age}: {
  lang?: keyof typeof allFakers,
  country: Countries,
  sex?: Sex,
  age?: { min: number, max: number, mode: 'age' | 'year' }
}): Promise<Person> {

  const faker = allFakers[lang as keyof typeof allFakers];

  // Set random sex if not defined
  const sex = _sex || faker.person.sex() as Sex;

  const firstName = faker.person.firstName(sex)
  const lastName = faker.person.lastName(sex)

  const address = {
    street: faker.location.streetAddress(),
    city: faker.location.city(),
    state: faker.location.state(),
    country,
  }

  const birthday = faker.date.birthdate(age);
  const phone = faker.phone.number({style: 'international'});
  const email = faker.internet.email({firstName, lastName})
  let civicNo: string | undefined;

  switch (country) {
    case 'Sweden':
      civicNo = await SwedishCivicNo(birthday, sex)
      break;
    case 'Spain':
      civicNo = SpanishCivicNo()
      break;
    case 'Norway':
      civicNo = await NorwegianCivicNo(birthday, sex);
      break;
    default:
      console.error('Unsupported country');
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

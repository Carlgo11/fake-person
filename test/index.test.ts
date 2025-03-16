import main from '../src/index.js';
import {describe, it} from 'node:test';
import assert from 'assert';

describe('generateFakeUser', async () => {
  await it('Should create a Swedish Person', async () => {
    const result = await main({lang: 'sv', country: 'Sweden'});
    console.log(result)
    assert.strictEqual(typeof result, 'object')
    assert.ok(result.birthday)
  });

  await it('Should create a Norwegian Person', async () => {
    const result = await main({lang: 'nb_NO', country: 'Norway'})
    console.log(result)
    assert.ok(result)
    assert.ok(result.birthday)
  });

  await it('Should create a Spanish Person', async () => {
    const result = await main({lang: 'es', country: 'Spain'})
    console.log(result)
    assert.ok(result)
    assert.ok(result.birthday)
  });
})
import { expect } from 'chai';
import Input from './inputValidator';


describe('Input validator', () => {
  const t = key => key;
  let name;
  let value;
  let require;

  beforeEach(() => {
    name = 'reference';
    value = '0';
    require = true;
  });

  it('Check Reference input, for lest than 64 chars', () => {
    require = false;
    const result = Input.validateInput(t, name, value, require);
    expect(result).to.equal(undefined);
  });

  it('Check Reference input, for more than 64 chars', () => {
    require = false;
    value = 'asdasdasdasdasdasadadsasdasasasdasdasdadasdasdasdasdasasdasasdasdasd';
    const result = Input.validateInput(t, name, value, require);
    expect(result).to.equal('Maximum length exceeded');
  });

  it('Check Amount input, with 0.1 as value', () => {
    name = 'amount';
    value = '0.1';
    const result = Input.validateInput(t, name, value, require);
    expect(result).to.equal(undefined);
  });

  it('Check Amount input, with 0 as value', () => {
    name = 'amount';
    value = '0';
    const result = Input.validateInput(t, name, value, require);
    expect(result).to.equal('Required');
  });

  it('Check Amount input, with leters as value', () => {
    name = 'amount';
    value = 'abc';
    const result = Input.validateInput(t, name, value, require);
    expect(result).to.equal('Invalid amount');
  });
});

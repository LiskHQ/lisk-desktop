import { expect } from 'chai';
import { getAutoLogInData, validateUrl } from './login';

describe('validateUrl', () => {
  // Arrange
  const settings = { settings: {} };
  const loginKey = 'dummy login';

  beforeEach(() => {
    localStorage.setItem('loginKey', loginKey);
    localStorage.setItem('settings', JSON.stringify({ ...settings }));
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should set address and addressValidity="" for a valid address', () => {
    const validURL = 'http://localhost:8080';
    const data = validateUrl(validURL);
    const expectedData = {
      address: validURL,
      addressValidity: '',
    };
    expect(data).to.deep.equal(expectedData);
  });

  it('should set address and addressValidity correctly event without http', () => {
    const validURL = '127.0.0.1:8080';
    const data = validateUrl(validURL);
    const expectedData = {
      address: validURL,
      addressValidity: '',
    };
    expect(data).to.deep.equal(expectedData);
  });

  it('should set address and addressValidity="Please check the address" for a valid address', () => {
    const validURL = 'http:localhost:8080';
    const data = validateUrl(validURL);
    const expectedData = {
      address: validURL,
      addressValidity: 'Please check the address',
    };
    expect(data).to.deep.equal(expectedData);
  });

  it('should get default login data when local storage has no data', () => {
    // Arrange
    localStorage.clear();

    // Act
    const data = getAutoLogInData();

    // Assert
    expect(data).to.deep.equal({});
  });

  it('should get auto login data', () => {
    // Act
    const data = getAutoLogInData();

    // Assert
    expect(data).to.deep.equal({
      loginKey,
      liskCustomNodeUrl: '',
      liskServiceUrl: '',
    });
  });
});

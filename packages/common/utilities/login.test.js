import { validateUrl, shouldAutoLogIn, addHttp } from './login';
import accounts from '../.././tests/constants/accounts';

describe('Login', () => {
  describe('addHttp', () => {
    it('should add http if needed', () => {
      expect(addHttp('example.com')).toEqual('https://example.com');
      expect(addHttp('http://example.com')).toEqual('http://example.com');
      expect(addHttp('192.168.0.0:8080')).toEqual('http://192.168.0.0:8080');
      expect(addHttp('192.168.0.0')).toEqual('http://192.168.0.0');
    });
  });

  describe('validateUrl', () => {
    it('should set address and addressValidity="" for a valid address', () => {
      const validURL = 'http://localhost:8080';
      const data = validateUrl(validURL);
      const expectedData = {
        address: validURL,
        addressValidity: '',
      };
      expect(data).toEqual(expectedData);
    });

    it('should set address and addressValidity correctly event without http', () => {
      const validURL = '127.0.0.1:8080';
      const data = validateUrl(validURL);
      const expectedData = {
        address: validURL,
        addressValidity: '',
      };
      expect(data).toEqual(expectedData);
    });

    it('should set address and addressValidity="Please check the address" for a valid address', () => {
      const validURL = 'http:localhost:8080';
      const data = validateUrl(validURL);
      const expectedData = {
        address: validURL,
        addressValidity: 'Please check the address',
      };
      expect(data).toEqual(expectedData);
    });
  });

  describe('shouldAutoLogIn', () => {
    it('should check if loginKey is stored and it is not empty', () => {
      expect(shouldAutoLogIn({ loginKey: '' })).toEqual(false);
      expect(shouldAutoLogIn({ loginKey: accounts.genesis.passphrase })).toEqual(true);
    });
  });
});

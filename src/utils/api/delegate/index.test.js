import * as delegate from './index';
import http from '../http';
import ws from '../ws';

jest.mock('../http');
jest.mock('../ws');

const setApiResponseData = (data, api) => {
  api.mockImplementation(() => Promise.resolve(data));
};
const setApiRejection = (statusText, api) => {
  api.mockImplementation(() => Promise.reject(new Error(statusText)));
};
const resetApiMock = () => {
  http.mockClear();
  ws.mockClear();
};

describe('API delegate module', () => {
  describe('getDelegate', () => {
    beforeEach(() => {
      resetApiMock();
    });

    it('should return a promise', async () => {
      const delegatePromise = delegate.getDelegate({});
      expect(typeof delegatePromise.then).toEqual('function');
      expect(typeof delegatePromise.catch).toEqual('function');
    });

    it('should reject promise if no parameters are supplied', async () => {
      await expect(delegate.getDelegate({ })).rejects;
    });

    it('should reject promise if conflicting parameters are supplied', async () => {
      const data = { address: '1L', publicKey: 'abcd1', username: 'del1' };
      await expect(delegate.getDelegate({ ...data })).rejects;
    });

    it('should return delegate data', async () => {
      const expectedResponse = { address: '1L', username: 'del1', data: {} };
      const data = { address: '1L' };
      setApiResponseData(expectedResponse, http);
      await expect(delegate.getDelegate({ ...data })).resolves.toEqual(expectedResponse);
    });

    it('should throw when api fails', async () => {
      const expectedResponse = new Error('API call could not be completed');
      const data = { address: '1L' };
      setApiRejection(expectedResponse.message, http);
      await expect(delegate.getDelegate({ ...data })).rejects.toEqual(expectedResponse);
    });
  });

  describe('getDelegates', () => {
    const addressList = ['1L', '2L'];
    const publicKeyList = ['abcd1', 'bad2'];
    const usernameList = ['del1', 'del2'];

    beforeEach(() => {
      resetApiMock();
    });

    it('should return a promise', async () => {
      const delegatePromise = delegate.getDelegates({});
      expect(typeof delegatePromise.then).toEqual('function');
      expect(typeof delegatePromise.catch).toEqual('function');
    });

    it('should reject promise if no parameters are supplied', async () => {
      await expect(delegate.getDelegates({ })).rejects;
    });

    it('should reject promise if conflicting parameters are supplied', async () => {
      const data = { addressList, publicKeyList, usernameList };
      await expect(delegate.getDelegates({ ...data })).rejects;
    });

    it('should ignore filtering parameters', () => {
      // TODO
    });

    it('should return delegates list when adressList is passed', async () => {
      const expectedResponse = [{}, {}, {}];
      const data = { addressList };
      setApiResponseData(expectedResponse, ws);
      await expect(delegate.getDelegates({ ...data })).resolves.toEqual(expectedResponse);
      expect(ws).toHaveBeenCalled();
      expect(http).not.toHaveBeenCalled();
    });

    it('should return delegates list when filters are passed', async () => {
      const expectedResponse = [{}, {}, {}];
      setApiResponseData(expectedResponse, http);
      await expect(
        delegate.getDelegates({ limit: 10, offset: 0 }),
      ).resolves.toEqual(expectedResponse);
      expect(ws).not.toHaveBeenCalled();
      expect(http).toHaveBeenCalled();
    });

    it('should throw when api fails', async () => {
      const expectedResponse = new Error('API call could not be completed');
      setApiRejection(expectedResponse.message, http);
      setApiRejection(expectedResponse.message, ws);
      await expect(
        delegate.getDelegates({ addressList }),
      ).rejects.toEqual(expectedResponse);
      await expect(
        delegate.getDelegates({ limit: 10, offset: 0 }),
      ).rejects.toEqual(expectedResponse);
    });
  });

  describe('getVotes', () => {
    const address = '1L';
    const publicKey = 'abcd1';

    beforeEach(() => {
      resetApiMock();
    });

    it('should return a promise', async () => {
      const delegatePromise = delegate.getVotes({});
      expect(typeof delegatePromise.then).toEqual('function');
      expect(typeof delegatePromise.catch).toEqual('function');
    });

    it('should reject promise if no parameters are supplied', async () => {
      await expect(delegate.getVotes({ })).rejects;
    });

    it('should reject promise if conflicting parameters are supplied', async () => {
      const data = { address, publicKey };
      await expect(delegate.getVotes({ ...data })).rejects;
    });

    it('should return votes list when adress is passed', async () => {
      const expectedResponse = [{}, {}, {}];
      const data = { address };
      setApiResponseData(expectedResponse, http);
      await expect(delegate.getVotes({ ...data })).resolves.toEqual(expectedResponse);
    });

    it('should throw when api fails', async () => {
      const expectedResponse = new Error('API call could not be completed');
      setApiRejection(expectedResponse.message, http);
      await expect(
        delegate.getVotes({ address }),
      ).rejects.toEqual(expectedResponse);
    });
  });

  describe('getVoters', () => {
    const address = '1L';
    const publicKey = 'abcd1';

    beforeEach(() => {
      resetApiMock();
    });

    it('should return a promise', async () => {
      const delegatePromise = delegate.getVoters({});
      expect(typeof delegatePromise.then).toEqual('function');
      expect(typeof delegatePromise.catch).toEqual('function');
    });

    it('should reject promise if no parameters are supplied', async () => {
      await expect(delegate.getVoters({ })).rejects;
    });

    it('should reject promise if conflicting parameters are supplied', async () => {
      const data = { address, publicKey };
      await expect(delegate.getVoters({ ...data })).rejects;
    });

    it('should return votes list when adress is passed', async () => {
      const expectedResponse = [{}, {}, {}];
      const data = { address };
      setApiResponseData(expectedResponse, http);
      await expect(delegate.getVoters({ ...data })).resolves.toEqual(expectedResponse);
    });

    it('should throw when api fails', async () => {
      const expectedResponse = new Error('API call could not be completed');
      setApiRejection(expectedResponse.message, http);
      await expect(
        delegate.getVoters({ address }),
      ).rejects.toEqual(expectedResponse);
    });
  });

  describe('getForgers', () => {
    it('should return a promise', async () => {
      const delegatePromise = delegate.getForgers({});
      expect(typeof delegatePromise.then).toEqual('function');
      expect(typeof delegatePromise.catch).toEqual('function');
    });

    it('should return forgers list when adress is passed', async () => {
      const expectedResponse = [{}, {}, {}];
      setApiResponseData(expectedResponse, http);
      await expect(delegate.getForgers({ limit: 5, offset: 0 })).resolves.toEqual(expectedResponse);
    });

    it('should throw when api fails', async () => {
      const expectedResponse = new Error('API call could not be completed');
      setApiRejection(expectedResponse.message, http);
      await expect(
        delegate.getForgers({ limit: 5, offset: 0 }),
      ).rejects.toEqual(expectedResponse);
    });
  });
});

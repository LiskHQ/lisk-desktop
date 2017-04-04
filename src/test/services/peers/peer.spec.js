const chai = require('chai');

const expect = chai.expect;

describe('Factory: $peer', () => {
  let $peer;
  let $httpBackend;
  let peer;
  let conf;
  let url;
  const account = { address: '16313739661670634666L' };

  beforeEach(angular.mock.module('app'));

  beforeEach(inject((_$peer_, _$httpBackend_) => {
    $peer = _$peer_;
    $httpBackend = _$httpBackend_;
    conf = {
      host: 'node07.lisk.io',
      port: 8000,
      ssl: true,
    };
    peer = new $peer(conf);
    url = `https://${conf.host}:${conf.port}`;
  }));

  afterEach(() => {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe('uri', () => {
    it('contains host:port if port specified', () => {
      const uri = peer.uri;
      expect(uri).to.equal(`${peer.host}:${peer.port}`);
    });

    it('contains host if port not specified', () => {
      conf.port = undefined;
      peer = new $peer(conf);
      const uri = peer.uri;
      expect(uri).to.equal(`${peer.host}:${peer.port}`);
    });
  });

  describe('getPeers()', () => {
    it('calls peers API and returns promise with peers ', () => {
      let response;
      const peers = ['TEST', 'PEER'];
      const data = {
        success: true,
        peers,
      };
      $httpBackend.whenGET(`${url}/api/peers?state=2`).respond(200, data);
      peer.getPeers().then((res) => {
        response = res;
      });

      $httpBackend.flush();
      expect(response).to.deep.equal(peers);
    });
  });

  describe('getAccount(address)', () => {
    it('calls account API and returns promise with the account', () => {
      let response;
      const data = {
        success: true,
        account,
      };

      $httpBackend.whenGET(`${url}/api/accounts?address=${account.address}`).respond(200, data);
      peer.getAccount(account.address).then((res) => {
        response = res;
      });

      $httpBackend.flush();
      expect(response).to.deep.equal(account);
    });

    it('calls account API and id request fails then calls balance API', () => {
      let response;
      const data = {
        success: false,
        message: 'Error occured',
      };

      $httpBackend.whenGET(`${url}/api/accounts?address=${account.address}`).respond(200, data);
      $httpBackend.whenGET(`${url}/api/accounts/getBalance?address=${account.address}`).respond(200, data);
      peer.getAccount(account.address).catch((res) => {
        response = res;
      });

      $httpBackend.flush();
      expect(response).to.deep.equal({ message: data.message });
    });
  });

  describe('getBalance(address)', () => {
    it('calls account API and returns promise with the balance', () => {
      let response;
      const data = {
        success: true,
        balance: 100000,
      };

      $httpBackend.whenGET(`${url}/api/accounts/getBalance?address=${account.address}`).respond(200, data);
      peer.getBalance(account.address).then((res) => {
        response = res;
      });

      $httpBackend.flush();
      expect(response).to.deep.equal(data.balance);
    });
  });

  describe('getTransactions(address, limit)', () => {
    it('calls account API and returns promise with the balance', () => {
      let response;
      const limit = 10;
      const orderBy = 'timestamp:desc';
      const data = {
        success: true,
        data: ['TEST', 'DATA'],
      };

      $httpBackend.whenGET(`${url}/api/transactions?limit=${limit}&orderBy=${orderBy}&recipientId=${account.address}&senderId=${account.address}`).respond(200, data);
      peer.getTransactions(account.address, limit, orderBy).then((res) => {
        response = res;
      });

      $httpBackend.flush();
      expect(response.data).to.deep.equal(data.data);
    });
  });

  describe('getNetHash()', () => {
    it('calls nethash API and returns promise with the nethash', () => {
      let response;
      const data = {
        success: true,
        nethash: '198f2b61a8eb95fbeed58b8216780b68f697f26b849acf00c8c93bb9b24f783d',
      };

      $httpBackend.whenGET(`${url}/api/blocks/getNetHash`).respond(200, data);
      peer.getNetHash().then((res) => {
        response = res;
      });

      $httpBackend.flush();
      expect(response).to.deep.equal(data.nethash);
    });
  });

  describe('sendTransaction(passphrase, secondPassphrase, recipient, amount)', () => {
    it('calls nethash API and returns promise with the nethash', () => {
      let response;
      const passphrase = 'wagon stock borrow episode laundry kitten salute link globe zero feed marble';
      const secondPassphrase = undefined;
      const recipient = '537318935439898807L';
      const amount = 10;
      const data = {
        success: true,
        nethash: '198f2b61a8eb95fbeed58b8216780b68f697f26b849acf00c8c93bb9b24f783d',
      };

      $httpBackend.whenGET(`${url}/api/blocks/getNetHash`).respond(200, data);
      $httpBackend.whenPOST(`${url}/peer/transactions`).respond(200, data);

      peer.sendTransaction(passphrase, secondPassphrase, recipient, amount).then((res) => {
        response = res;
      });

      $httpBackend.flush();
      expect(response.data).to.deep.equal(data);
    });
  });

  describe('status()', () => {
    it('calls status API and returns promise with the status', () => {
      let response;
      const data = {
        success: true,
        loaded: true,
        now: 41646,
        blocksCount: 0,
      };

      $httpBackend.whenGET(`${url}/api/loader/status`).respond(200, data);
      peer.status().then((res) => {
        response = res;
      });

      $httpBackend.flush();
      expect(response).to.deep.equal(data);
    });
  });
});


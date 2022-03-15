import bitcoin from 'bitcoinjs-lib';

import { getAccount } from './btc';
import http from '../http';

jest.mock('../http', () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe('API: BTC Accounts', () => {
  const network = {
    networks: {
      BTC: {
        serviceUrl: 'http://sample.com/',
        name: 'mainnet',
        network: bitcoin.networks.bitcoin,
        derivationPath: "m/44'/0'/0'/0/0",
      },
    },
  };
  const response = {
    data: {
      confirmed_balance: 10000,
    },
  };

  describe('getAccount', () => {
    const address = '1NoSJaLEQEsytiHtturoa8GqibF421EvSE';
    const passphrase = 'brother voyage local again soccer dismiss inherit interest please access repeat divorce';

    it('Should call http with with given address', async () => {
      jest.clearAllMocks();
      http.mockResolvedValue(response);

      await getAccount({
        network,
        params: { address },
      });

      expect(http).toHaveBeenCalledWith({
        network,
        baseUrl: 'http://sample.com/',
        path: `/account/${address}`,
      });
    });

    it('Should call http with corresponding address derived from the given passphrase', async () => {
      jest.clearAllMocks();
      http.mockResolvedValue(response);

      await getAccount({
        network,
        params: { passphrase },
      });

      expect(http).toHaveBeenCalledWith({
        network,
        baseUrl: 'http://sample.com/',
        path: `/account/${address}`,
      });
    });

    it('should return empty account if the API returns 404', async () => {
      http.mockImplementation(() => Promise.reject(Error('Account not found.')));
      // Checks the baseUrl too
      const result = await getAccount({
        network,
        params: {
          passphrase,
        },
      });

      expect(result).toEqual({
        summary: {
          address,
          balance: 0,
        },
        token: {
          balance: 0,
        },
      });
    });
  });
});

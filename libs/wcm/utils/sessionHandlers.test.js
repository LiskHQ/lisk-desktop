import wallets from '@tests/constants/wallets';
import { client } from '@libs/wcm/utils/connectionCreator';
import { onApprove, onReject } from './sessionHandlers';
import { STATUS, ERROR_CASES } from '../constants/lifeCycle';

jest.mock('@walletconnect/utils', () => ({
  getSdkError: jest.fn((str) => str),
}));

jest.mock('@libs/wcm/utils/connectionCreator', () => ({
  client: {
    approve: jest.fn().mockImplementation(() =>
      Promise.resolve({
        acknowledged: jest.fn(),
      })
    ),
    reject: jest.fn().mockImplementation(() => Promise.resolve({})),
  },
}));

describe('sessionHandlers', () => {
  const proposal = {
    params: {
      requiredNamespaces: [],
      relays: [{ protocol: 'LSK' }],
    },
    id: 'sample_id',
  };
  const selectedAccounts = [wallets.genesis.summary.address, wallets.validator.summary.address];

  describe('onApprove', () => {
    it('Should client.approve with correct arguments', async () => {
      const res = await onApprove(proposal, selectedAccounts);
      expect(client.approve).toHaveBeenCalledWith({
        id: proposal.id,
        namespaces: {},
        relayProtocol: proposal.params.relays[0].protocol,
      });
      expect(res).toEqual(STATUS.SUCCESS);
    });

    it('Should throw error if selectedAccounts is not a list of addresses', async () => {
      client.approve.mockImplementation(() => Promise.reject(new Error('Accounts are invalid')));
      const res = await onApprove(proposal, []);
      expect(res).toEqual(STATUS.FAILURE);
    });
  });

  describe('onReject', () => {
    it('Should client.approve with correct arguments', async () => {
      await onReject(proposal);

      expect(client.reject).toHaveBeenCalledWith({
        id: proposal.id,
        reason: ERROR_CASES.USER_REJECTED_METHODS,
      });
    });
  });
});

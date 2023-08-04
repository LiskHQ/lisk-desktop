import wallets from '@tests/constants/wallets';
import { onApprove, onReject } from './sessionHandlers';
import { STATUS, ERROR_CASES } from '../constants/lifeCycle';

jest.mock('@walletconnect/utils', () => ({
  getSdkError: jest.fn((str) => str),
}));

describe('sessionHandlers', () => {
  const signClient = {
    approve: jest.fn().mockImplementation(() =>
      Promise.resolve({
        acknowledged: jest.fn(),
      })
    ),
    reject: jest.fn().mockImplementation(() => Promise.resolve({})),
  };

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
      const res = await onApprove(proposal, selectedAccounts, signClient);
      expect(signClient.approve).toHaveBeenCalledWith({
        id: proposal.id,
        namespaces: {},
        relayProtocol: proposal.params.relays[0].protocol,
      });
      expect(res).toEqual(STATUS.SUCCESS);
    });

    it('Should throw error if selectedAccounts is not a list of addresses', async () => {
      signClient.approve.mockImplementation(() =>
        Promise.reject(new Error('Accounts are invalid'))
      );
      const res = await onApprove(proposal, [], signClient);
      expect(res).toEqual(STATUS.FAILURE);
    });
  });

  describe('onReject', () => {
    it('Should client.approve with correct arguments', async () => {
      await onReject(proposal, signClient);

      expect(signClient.reject).toHaveBeenCalledWith({
        id: proposal.id,
        reason: ERROR_CASES.USER_REJECTED_METHODS,
      });
    });
  });
});

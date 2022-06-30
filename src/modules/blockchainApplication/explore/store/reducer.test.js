import mockBlockchainApplications from '@tests/fixtures/blockchainApplications';
import actionTypes from './actionTypes';
import { pins } from './reducer';

describe('BlockchainApplication reducer', () => {
  it('Should return list of chainIds', async () => {
    const actionData = {
      type: actionTypes.setApplicationPin,
      chainId: mockBlockchainApplications[0].chainID,
    };
    expect(pins([], actionData)).toContain(actionData.chainId);
  });

  it('Should return list of chainIds without the removed one', async () => {
    const actionData = {
      type: actionTypes.removeApplicationPin,
      chainId: mockBlockchainApplications[0].chainID,
    };
    expect(pins([mockBlockchainApplications[0].chainID], actionData)).not
      .toContain(actionData.chainId);
  });
});

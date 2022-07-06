import mockApplicationsManage from '@tests/fixtures/blockchainApplicationsManage';
import mockApplicationsExplore from '@tests/fixtures/blockchainApplicationsExplore';
import actionTypes from './actionTypes';
import { pins, current } from './reducer';

describe('BlockchainApplication reducer', () => {
  it('Should return list of chainIds', async () => {
    const actionData = {
      type: actionTypes.toggleApplicationPin,
      chainId: mockApplicationsExplore[0].chainID,
    };

    expect(pins([], actionData)).toContain(actionData.chainId);
  });

  it('Should return list of chainIds without the removed one', async () => {
    const actionData = {
      type: actionTypes.toggleApplicationPin,
      chainId: mockApplicationsExplore[0].chainID,
    };

    expect(pins([mockApplicationsExplore[0].chainID], actionData)).not
      .toContain(actionData.data);
  });
  it('Should return list of chainIds without the removed one', async () => {
    const actionData = {
      type: actionTypes.toggleApplicationPin,
      chainId: mockApplicationsExplore[0].chainID,
    };

    expect(pins([mockApplicationsExplore[0].chainID], actionData)).not
      .toContain(actionData.data);
  });

  it('Should return current application if setCurrentApplication action type is triggered', async () => {
    const actionData = {
      type: actionTypes.setCurrentApplication,
      application: mockApplicationsManage[0],
    };
    expect(current({}, actionData)).toEqual(mockApplicationsManage[0]);
  });
});

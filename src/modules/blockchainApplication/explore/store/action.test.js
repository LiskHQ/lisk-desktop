/* eslint-disable max-lines */
import mockBlockchainApplications from '@tests/fixtures/blockchainApplications';
import actionTypes from './actionTypes';
import {
  removePinnedApplication,
  pinApplication,
} from './action';

const chainId = mockBlockchainApplications[0].chainID;

describe('actions:  blockchainApplication', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should create an action to pin blockchain application', () => {
    const expectedAction = {
      type: actionTypes.setApplicationPin,
      chainId,
    };

    expect(pinApplication(chainId)).toEqual(expectedAction);
  });
  it('should create an action to remove blockchain application', () => {
    const expectedAction = {
      type: actionTypes.removeApplicationPin,
      chainId,
    };

    expect(removePinnedApplication(chainId)).toEqual(expectedAction);
  });
});

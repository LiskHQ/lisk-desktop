/* eslint-disable max-lines */
import mockBlockchainApplications from '@tests/fixtures/blockchainApplications';
import actionTypes from './actionTypes';
import {
  toggleApplicationPin,
} from './action';

const chainId = mockBlockchainApplications[0].chainID;

describe('actions:  blockchainApplication', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should create an action to toggle blockchain application', () => {
    const expectedAction = {
      type: actionTypes.toggleApplicationPin,
      chainId,
    };

    expect(toggleApplicationPin(chainId)).toEqual(expectedAction);
  });
});

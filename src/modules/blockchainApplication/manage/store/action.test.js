/* eslint-disable max-lines */
import mockBlockchainApplications from '@tests/fixtures/blockchainApplications';
import actionTypes from './actionTypes';
import {
  toggleApplicationPin,
  addApplication,
  deleteApplication,
} from './action';

const chainId = mockBlockchainApplications[0].chainID;
const sampleBlockchainApplication = mockBlockchainApplications[0];

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

  it('should create an action to add blockchain application', () => {
    const expectedAction = {
      type: actionTypes.addApplicationByChainId,
      data: mockBlockchainApplications[0],
    };

    expect(addApplication(sampleBlockchainApplication)).toEqual(expectedAction);
  });

  it('should create an action to delete blockchain application', () => {
    const expectedAction = {
      type: actionTypes.deleteApplicationByChainId,
      data: chainId,
    };

    expect(deleteApplication(chainId)).toEqual(expectedAction);
  });
});

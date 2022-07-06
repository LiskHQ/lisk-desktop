/* eslint-disable max-lines */
import mockApplications from '@tests/fixtures/blockchainApplicationsManage';
import actionTypes from './actionTypes';
import {
  toggleApplicationPin,
  setCurrentApplication,
} from './action';

const chainId = mockApplications[0].chainID;

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

  it('should create an action to set current application', () => {
    const expectedAction = {
      type: actionTypes.setCurrentApplication,
      application: mockApplications[0],
    };

    expect(setCurrentApplication(mockApplications[0])).toEqual(expectedAction);
  });
});

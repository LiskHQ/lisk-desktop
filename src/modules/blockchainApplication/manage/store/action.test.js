/* eslint-disable max-lines */
import mockApplications from '@tests/fixtures/blockchainApplicationsManage';
import actionTypes from './actionTypes';
import {
  toggleApplicationPin,
  addApplication,
  deleteApplication,
  setCurrentApplication,
  setApplications,
} from './action';

const chainId = mockApplications[0].chainID;
const sampleBlockchainApplication = mockApplications[0];

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
      app: sampleBlockchainApplication,
    };

    expect(addApplication(sampleBlockchainApplication)).toEqual(expectedAction);
  });

  it('should create an action to add blockchain applications', () => {
    const expectedAction = {
      type: actionTypes.setApplications,
      apps: mockApplications.slice(0, 2),
    };

    expect(setApplications(mockApplications.slice(0, 2))).toEqual(expectedAction);
  });

  it('should create an action to delete blockchain application', () => {
    const expectedAction = {
      type: actionTypes.deleteApplicationByChainId,
      chainId,
    };

    expect(deleteApplication(chainId)).toEqual(expectedAction);
  });

  it('should create an action to set current application', () => {
    const expectedAction = {
      type: actionTypes.setCurrentApplication,
      app: mockApplications[0],
    };

    expect(setCurrentApplication(mockApplications[0])).toEqual(expectedAction);
  });
});

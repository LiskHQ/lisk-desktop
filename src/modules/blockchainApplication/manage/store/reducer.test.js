import mockApplicationsManage from '@tests/fixtures/blockchainApplicationsManage';
import mockApplicationsExplore, { applicationsMap } from '@tests/fixtures/blockchainApplicationsExplore';
import actionTypes from './actionTypes';
import { pins, applications, current } from './reducer';

describe('BlockchainApplication reducer', () => {
  describe('pins', () => {
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
  });

  describe('applications', () => {
    it('Should return list of applications with newly added application', async () => {
      const newApplication = {
        name: 'New app',
        chainID: 'aq02qkbb35u4jdq2szo6ytre',
        state: 'active',
        address: 'lskm555k7nhhw954rw4pqy5q9wn28n3cec94fmp4n',
        lastCertificateHeight: 3000,
        lastUpdated: 789456123,
      };
      const actionData = {
        type: actionTypes.addApplicationByChainId,
        data: newApplication,
      };
      const changedState = applications(applicationsMap, actionData);

      expect(changedState).toHaveProperty(newApplication.chainID, newApplication);
    });

    it('Should return list of applications without the removed one', async () => {
      const actionData = {
        type: actionTypes.deleteApplicationByChainId,
        data: mockApplicationsExplore[1].chainID,
      };
      const changedState = applications(applicationsMap, actionData);

      expect(changedState).not.toHaveProperty(actionData.data);
    });
  });

  describe('pins', () => {
    it('Should return current application if setCurrentApplication action type is triggered', async () => {
      const actionData = {
        type: actionTypes.setCurrentApplication,
        application: mockApplicationsManage[0],
      };
      expect(current({}, actionData)).toEqual(mockApplicationsManage[0]);
    });
  });
});

import mockApplicationsManage, {
  applicationsMap,
} from '@tests/fixtures/blockchainApplicationsManage';
import mockApplicationsExplore from '@tests/fixtures/blockchainApplicationsExplore';
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

      expect(pins([mockApplicationsExplore[0].chainID], actionData)).not.toContain(actionData.data);
    });
  });

  describe('applications', () => {
    it('Should return list of applications with newly added application', async () => {
      const newApplication = {
        name: 'New app',
        chainID: 'aq02qkbb35u4jdq2szo6ytre',
        state: 'active',
        apis: [{ rest: 'https://service.newapp.com', rpc: 'wss://service.newapp.com' }],
        lastUpdated: 789456123,
      };
      const actionData = {
        type: actionTypes.addApplicationByChainId,
        app: newApplication,
      };
      const changedState = applications(applicationsMap, actionData);

      expect(changedState).toHaveProperty(newApplication.chainID, newApplication);
    });

    it('Should return list of applications without the removed one', async () => {
      const actionData = {
        type: actionTypes.deleteApplicationByChainId,
        chainId: mockApplicationsManage[1].chainID,
      };
      const changedState = applications(applicationsMap, actionData);

      expect(changedState).not.toHaveProperty(actionData.chainId);
    });

    it('Should return list of applications with the newly added applications', async () => {
      const newApplication1 = {
        name: 'New app',
        chainID: '00002000',
        state: 'active',
        apis: [{ rest: 'https://service.newapp1.com', rpc: 'wss://service.newapp1.com' }],
        lastUpdated: 78946123,
      };
      const newApplication2 = {
        name: 'New app2',
        chainID: '00004000',
        state: 'active',
        apis: [{ rest: 'https://service.newapp2.com', rpc: 'wss://service.newapp2.com' }],
        lastUpdated: 78945123,
      };
      const actionData = {
        type: actionTypes.setApplications,
        apps: [newApplication1, newApplication2],
      };
      const changedState = applications(applicationsMap, actionData);

      expect(changedState).toHaveProperty(newApplication1.chainID, newApplication1);
      expect(changedState).toHaveProperty(newApplication2.chainID, newApplication2);
    });
  });

  describe('current', () => {
    it('Should return current application if setCurrentApplication action type is triggered', async () => {
      const actionData = {
        type: actionTypes.setCurrentApplication,
        app: mockApplicationsManage[0],
      };
      expect(current({}, actionData)).toEqual(mockApplicationsManage[0]);
    });
  });
});

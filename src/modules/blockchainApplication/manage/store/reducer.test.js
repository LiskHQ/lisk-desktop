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
      const newApplication = mockApplicationsManage[0];
      const actionData = {
        type: actionTypes.addApplicationByChainId,
        app: newApplication,
        network: 'devnet',
      };
      const changedState = applications({ devnet: applicationsMap }, actionData);
      expect(changedState).toHaveProperty('devnet', applicationsMap);
    });

    it('Should return list of applications without the removed one', async () => {
      const actionData = {
        type: actionTypes.deleteApplicationByChainId,
        chainId: mockApplicationsManage[1].chainID,
        network: 'devnet',
      };
      const changedState = applications({ devnet: applicationsMap }, actionData);
      expect(changedState).not.toHaveProperty(actionData.chainId);
    });

    it('Should return list of applications with the newly added applications', async () => {
      const newApplication1 = mockApplicationsManage[0];
      const newApplication2 = mockApplicationsManage[1];
      const actionData = {
        type: actionTypes.setApplications,
        apps: [newApplication1, newApplication2],
        network: 'devnet',
      };
      const changedState = applications({ devnet: applicationsMap }, actionData);

      expect(changedState).toHaveProperty('devnet', {
        ...applicationsMap,
        [newApplication1.chainID]: newApplication1,
        [newApplication2.chainID]: newApplication2,
      });
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

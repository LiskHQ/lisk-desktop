import mockApplicationsManage, {
  applicationsMap,
} from '@tests/fixtures/blockchainApplicationsManage';
import mockApplicationsExplore from '@tests/fixtures/blockchainApplicationsExplore';
import actionTypes from './actionTypes';
import { pins, applications, current } from './reducer';

describe('BlockchainApplication reducer', () => {
  describe('pins', () => {
    it('should return list of chaifnIds', async () => {
      const actionData = {
        type: actionTypes.toggleApplicationPin,
        chainId: mockApplicationsExplore[0].chainID,
      };

      expect(pins([], actionData)).toContain(actionData.chainId);
    });

    it('should return list of chainIds without the removed one', async () => {
      const actionData = {
        type: actionTypes.toggleApplicationPin,
        chainId: mockApplicationsExplore[0].chainID,
      };

      expect(pins([mockApplicationsExplore[0].chainID], actionData)).not.toContain(actionData.data);
    });

    it('should also delete pinned application if chainID is in list', async () => {
      const actionData = {
        type: actionTypes.deleteApplicationByChainId,
        chainId: mockApplicationsExplore[1].chainID,
      };
      const pinnedList = [mockApplicationsExplore[0].chainID, mockApplicationsExplore[1].chainID];

      expect(pins(pinnedList, actionData)).not.toContain(actionData.data);
    });

    it('should return state if chainID is not in list', async () => {
      const actionData = {
        type: actionTypes.deleteApplicationByChainId,
        chainId: mockApplicationsExplore[1].chainID,
      };
      const pinnedList = [mockApplicationsExplore[0].chainID];

      expect(pins(pinnedList, actionData)).toEqual(pinnedList);
    });
  });

  describe('applications', () => {
    it('should return list of applications with newly added application', async () => {
      const newApplication = mockApplicationsManage[0];
      const actionData = {
        type: actionTypes.addApplicationByChainId,
        app: newApplication,
        network: 'devnet',
      };
      const changedState = applications({ devnet: applicationsMap }, actionData);
      expect(changedState).toHaveProperty('devnet', applicationsMap);
    });

    it('should cleanup invalid applications', async () => {
      const actionData = {
        type: actionTypes.cleanupApplications,
      };
      const invalidState = { ...applicationsMap, undefined: {}, null: {}, dummy: {} };
      expect(Object.keys(invalidState).filter((a) => a === 'undefined')).toHaveLength(1);
      const changedState = applications({ devnet: invalidState }, actionData);
      expect(changedState).toHaveProperty('devnet', applicationsMap);
      expect(Object.keys(changedState.devnet).filter((a) => a === 'undefined')).toHaveLength(0);
    });

    it('should return list of applications without the removed one', async () => {
      const actionData = {
        type: actionTypes.deleteApplicationByChainId,
        chainId: mockApplicationsManage[1].chainID,
        network: 'devnet',
      };
      const changedState = applications({ devnet: applicationsMap }, actionData);
      expect(changedState).not.toHaveProperty(actionData.chainId);
    });

    it('should delete networks in applications', async () => {
      const actionData = {
        type: actionTypes.deleteNetworksInApplications,
        networks: ['devnet'],
      };

      const changedState = applications(
        { devnet: applicationsMap, betanet: applicationsMap },
        actionData
      );
      expect(changedState).toEqual({ betanet: applicationsMap });
    });

    it('should return list of applications with the newly added applications', async () => {
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
    it('should return current application if setCurrentApplication action type is triggered', async () => {
      const actionData = {
        type: actionTypes.setCurrentApplication,
        app: mockApplicationsManage[0],
      };
      expect(current({}, actionData)).toEqual(mockApplicationsManage[0]);
    });
  });
});

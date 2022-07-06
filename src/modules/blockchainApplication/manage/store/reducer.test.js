import mockBlockchainApplications, { applicationsMap } from '@tests/fixtures/blockchainApplications';
import actionTypes from './actionTypes';
import { pins, applications } from './reducer';

describe('BlockchainApplication reducer', () => {
  describe('pins', () => {
    it('Should return list of chainIds', async () => {
      const actionData = {
        type: actionTypes.toggleApplicationPin,
        chainId: mockBlockchainApplications[0].chainID,
      };

      expect(pins([], actionData)).toContain(actionData.chainId);
    });

    it('Should return list of chainIds without the removed one', async () => {
      const actionData = {
        type: actionTypes.toggleApplicationPin,
        chainId: mockBlockchainApplications[0].chainID,
      };

      expect(pins([mockBlockchainApplications[0].chainID], actionData)).not
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
        data: mockBlockchainApplications[1].chainID,
      };
      const changedState = applications(applicationsMap, actionData);

      expect(changedState).not.toHaveProperty(actionData.data);
    });
  });
});

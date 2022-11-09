// @todo Add tests by #4418
// import { approveLiskRequest, rejectLiskRequest } from './requestHandlers';

describe('requestHandlers', () => {
  describe('Sign transaction', () => {
    describe('approveLiskRequest', () => {
      it.todo('Sign tx using private key of the sender account (given params are ok)');
      it.todo('Throw error if tx object is invalid');
      it.todo('Throw error if tx object does not match the schema');
      it.todo('Throw error if wallet is not the same as the sender');
    });
  });

  describe('Sign message', () => {
    describe('approveLiskRequest', () => {
      it.todo('Digest the message and sign using private key');
      it.todo('Throw error if message was undefined');
      it.todo('Throw error if wallet did not match the request account');
    });
  });

  describe('rejectLiskRequest', () => {
    it.todo('Calls formatJsonRpcError with correct id and error message');
  });
});

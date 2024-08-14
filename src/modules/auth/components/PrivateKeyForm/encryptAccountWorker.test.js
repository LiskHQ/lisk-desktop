import { encryptPrivateKeyAccount } from '../../../account/utils';
import './encryptAccount.worker';

window.self.postMessage = jest.fn();

jest.mock('../../../account/utils');

describe('encrypt account worker', () => {
  const data = {
    privateKey: 'test-private-key',
    password: 'test-password',
    accountName: 'test-account-name',
  };

  it('should invoke encryptPrivateKeyAccount method', async () => {
    encryptPrivateKeyAccount.mockResolvedValue({});
    window.self.onmessage({ data });
    expect(encryptPrivateKeyAccount).toHaveBeenCalled();

    jest.resetAllMocks();
    encryptPrivateKeyAccount.mockRejectedValue({});
    window.self.onmessage({ data });
    expect(encryptPrivateKeyAccount).toHaveBeenCalled();
  });
});

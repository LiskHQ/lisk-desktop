import { decryptAccount } from '../../../account/utils';
import './decryptAccountWorker';

window.self.postMessage = jest.fn();

jest.mock('../../../account/utils');

describe('encrypt account worker', () => {
  const data = {
    account: { crypto: {} },
    password: 'test-password',
  };

  it('should invoke decryptAccount method', async () => {
    decryptAccount.mockResolvedValue({});
    window.self.onmessage({ data });
    expect(decryptAccount).toHaveBeenCalled();

    jest.resetAllMocks();
    decryptAccount.mockRejectedValue({});
    window.self.onmessage({ data });
    expect(decryptAccount).toHaveBeenCalled();
  });
});

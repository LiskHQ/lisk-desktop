import { txStatusTypes } from '@transaction/configuration/txStatus';
import getIllustration from './illustrationsMap';

describe('getIllustration', () => {
  it('displays illustration type for all non hardware wallet statuses', () => {
    const txStatus = txStatusTypes.signatureSuccess;
    const illustration = 'stake';
    const accountHwInfo = {};
    expect(getIllustration(txStatus, illustration, accountHwInfo)).toEqual('stakingSuccess');
  });

  it('displays illustration type for all hardware wallet status', () => {
    const txStatus = txStatusTypes.hwRejected;
    const illustration = 'stake';
    const accountHwInfo = { deviceId: 1, deviceModel: 'trezor' };
    expect(getIllustration(txStatus, illustration, accountHwInfo)).toEqual('trezorHwRejection');
  });
});

import { txStatusTypes } from '@transaction/configuration/txStatus';
import getIllustration from './illustrationsMap';

describe('getIllustration', () => {
  it('displays illustration type for all non hardware wallet statuses', () => {
    const txStatus = txStatusTypes.signatureSuccess;
    const illustration = 'stake';
    expect(getIllustration(txStatus, illustration)).toEqual('stakingSuccess');
  });

  it('displays illustration type for all hardware wallet status', () => {
    const txStatus = txStatusTypes.hwRejected;
    const illustration = 'stake';
    expect(getIllustration(txStatus, illustration)).toEqual('hwRejection');
  });
});

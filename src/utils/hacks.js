import liskClient from 'Utils/lisk-client'; // eslint-disable-line

// The following function is used as a hack to fix timestamp issues.
// The problem is that Windows has often local time little bit in future and
// Lisk Core doesn't accept transactions with timestampt in the future.
//
// The workaround is to get timestamp from the last block, but lisk-elemnts
// accepts only time offset so this util is creating that.
//
// For more info, see:
// https://github.com/LiskHQ/lisk-desktop/issues/1277
//
// eslint-disable-next-line import/prefer-default-export
export const getTimeOffset = (latestBlocks) => {
  const Lisk = liskClient();
  return (
    latestBlocks.length && latestBlocks[0].timestamp
      ? latestBlocks[0].timestamp - Lisk.transaction.utils.getTimeFromBlockchainEpoch()
      : 0
  );
};

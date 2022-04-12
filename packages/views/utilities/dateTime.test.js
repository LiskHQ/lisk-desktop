import {
  getUnixTimestampFromValue,
  convertUnixSecondsToLiskEpochSeconds,
} from './dateTime';

describe('Datetime', () => {
  describe('getUnixTimestampFromValue', () => {
    it('should return valid unix timestamp', () => {
      expect(getUnixTimestampFromValue(131302820)).toEqual(131302820000);
    });
  });

  describe('convertUnixSecondsToLiskEpochSeconds', () => {
    it('should return valid unix timestamp', () => {
      expect(convertUnixSecondsToLiskEpochSeconds(1595584910)).toEqual(131475710);
    });
  });
});

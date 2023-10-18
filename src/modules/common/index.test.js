const { INFO_BANNERS } = require('./constants');

describe('contants', () => {
  const banners = Object.values(INFO_BANNERS);
  const t = (message) => message;

  function testFunction(data) {
    const { infoMessage, infoDescription, illustrationName } = data;

    expect(infoMessage(t)).toBeTruthy();
    expect(infoDescription(t)).toBeTruthy();
    expect(illustrationName).toBeTruthy();
  }

  it.each(banners)('returns the right values', testFunction);
});

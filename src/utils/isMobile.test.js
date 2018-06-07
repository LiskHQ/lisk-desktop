import { expect } from 'chai';
import isMobile from './isMobile';

describe('Check Mobile Utils', () => {
  const mobileNotAndroid = 'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3 like Mac OS X) AppleWebKit/602.1.50 (KHTML, like Gecko) CriOS/56.0.2924.75 Mobile/14E5239e Safari/602.1';
  const mobileAndroid = 'Mozilla/5.0 (Linux; Android 4.0.4; Galaxy Nexus Build/IMM76B) AppleWebKit/535.19 (KHTML, like Gecko) Chrome/18.0.1025.133 Mobile Safari/535.19';
  const notMobile = 'navigator.userAgent Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36';

  const { vendor, userAgent } = navigator;
  it('Returns if mobile given different circumstances', () => {
    // set vendor to null
    Object.defineProperty(window.navigator, 'vendor', {
      value: null,
      writable: true,
    });

    // set userAgent to null
    Object.defineProperty(window.navigator, 'userAgent', {
      value: null,
      writable: true,
    });

    // check if mobile
    expect(isMobile()).to.equal(false);

    // reset the vendor to what it was originally
    window.navigator.vendor = vendor;

    // test if android
    expect(isMobile(null, 'android')).to.equal(false);

    // set userAgent to android
    window.navigator.userAgent = mobileAndroid;

    // test if android
    expect(isMobile(null, 'android')).to.equal(true);

    // now test with agent as param
    expect(isMobile(notMobile)).to.equal(false);
    expect(isMobile(mobileNotAndroid, 'android')).to.equal(false);

    // reset the userAgent to what it was originally
    window.navigator.userAgent = userAgent;
  });
});

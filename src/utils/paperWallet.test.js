import { waitFor } from '@testing-library/dom';
import renderPaperWallet from './paperWallet';

const JSPDF = jest.fn(() => {
  const doc = {};
  doc.addImage = jest.fn(() => doc);
  doc.setFont = jest.fn(() => doc);
  doc.addFont = jest.fn(() => doc);
  doc.setFontSize = jest.fn(() => doc);
  doc.setFillColor = jest.fn(() => doc);
  doc.addFileToVFS = jest.fn(() => doc);
  doc.setTextColor = jest.fn(() => doc);
  doc.rect = jest.fn(() => doc);
  doc.text = jest.fn(() => doc);
  doc.save = jest.fn(() => doc);

  return doc;
});

jest.mock('@wallet/utils/account', () => ({
  ...jest.requireActual('@wallet/utils/account'),
  extractKeyPair: jest.fn(() => ({
    publicKey: '0792fecbbecf6e7370f7a7b217a9d159f380d3ecd0f2760d7a55dd3e27e97184',
  })),
}));

jest.mock('@liskhq/lisk-client', () => ({
  ...jest.requireActual('@liskhq/lisk-client'),
  cryptography: {
    ...jest.requireActual('@liskhq/lisk-client').cryptography,
    address: {
      getLisk32AddressFromPublicKey: jest.fn(() => 'lskdgtenb76rf93bzd56cqn6ova46wfvoesbk4hnd'),
    },
  },
}));

describe('Paper Wallet', () => {
  const data = {
    t: jest.fn((str) => str),
    passphrase: 'peanut hundred pen hawk invite exclude brain chunk gadget wait wrong ready',
    qrcode: 'qrcode',
    now: new Date('2018-04-05T10:20:30Z'),
  };
  const walletName = 'walletName';

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call JSPDF with right params', async () => {
    await renderPaperWallet(JSPDF, data, walletName);

    await waitFor(() => {
      expect(JSPDF).toHaveBeenCalledWith({
        orientation: 'p',
        unit: 'pt',
        format: [600, 900],
      });
    });
  });

  it('should render the information', async () => {
    const doc = await renderPaperWallet(JSPDF, data, walletName);
    await waitFor(() => {
      expect(doc.setFont).toHaveBeenCalledWith('gilroy', 'normal', 'bold');
      expect(doc.setFontSize).toHaveBeenCalledWith(16);
      expect(doc.text).toHaveBeenNthCalledWith(1, 'Paper wallet', 135, 64, {
        align: 'left',
        baseline: 'top',
        charSpace: 0.05,
        lineHeightFactor: 1.18,
      });
      expect(doc.text).toHaveBeenNthCalledWith(2, 'Store this document in a safe place.', 135, 84, {
        align: 'left',
        baseline: 'top',
        charSpace: 0.05,
        lineHeightFactor: 1.57,
      });
      expect(doc.text).toHaveBeenNthCalledWith(3, '05.04.2018', 568, 75, {
        align: 'right',
        baseline: 'top',
        charSpace: 0.05,
        lineHeightFactor: 1.18,
      });
      expect(doc.setFontSize).toHaveBeenNthCalledWith(1, 16);
      expect(doc.setFontSize).toHaveBeenNthCalledWith(2, 14);
    });
  });
});

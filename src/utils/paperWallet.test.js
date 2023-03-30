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

  it('should call JSPDF with right params', () => {
    renderPaperWallet(JSPDF, data, walletName);
    expect(JSPDF).toHaveBeenCalledWith({
      orientation: 'p',
      unit: 'pt',
      format: [600, 900],
    });
  });

  it('should render the information', () => {
    const doc = renderPaperWallet(JSPDF, data, walletName);
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

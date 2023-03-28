/* istanbul ignore file */
import { extractAddressFromPassphrase } from '@wallet/utils/account';
import logo from '@setup/react/assets/images/paperWallet/lisk-logo-blue-on-white-rgb.png';
import usbStick from '@setup/react/assets/images/paperWallet/usb-stick.png';
import printer from '@setup/react/assets/images/paperWallet/print.png';
import fonts from './paperWalletFonts';

class PaperWallet {
  constructor(JSPDF, props) {
    this.doc = new JSPDF({
      orientation: 'p',
      unit: 'pt',
      format: [600, 900],
    });
    this.props = props;

    this.setupDoc();
  }

  setupDoc() {
    const { passphrase } = this.props;
    let line = -1;
    this.passphrase = passphrase.split(/\s/).reduce((acc, word, index) => {
      line += index % 6 === 0 ? 1 : 0;
      acc[line] = acc[line] ? `${acc[line]} ${word}` : word;
      return acc;
    }, []);

    this.textOptions = {
      align: 'left',
      baseline: 'top',
      charSpace: 0.05,
      lineHeightFactor: 1.57,
    };

    this.doc
      .addFileToVFS('Gilroy-Bold.ttf', fonts.GilroyBold)
      .addFont('Gilroy-Bold.ttf', 'gilroy', 'normal', 'bold');
    this.doc.setTextColor(48, 48, 48).setFont('gilroy');
  }

  renderHeader() {
    const { t, now } = this.props;
    const textOptions = this.textOptions;
    const date = [
      `0${now.getDate()}`.substr(-2),
      `0${now.getMonth() + 1}`.substr(-2),
      `${now.getFullYear()}`,
    ];

    this.doc.addImage(logo, 'PNG', 32, 72, 67, 26);

    this.doc
      .setFont('gilroy', 'normal', 'bold')
      .setFontSize(16)
      .text(t('Paper wallet'), 135, 64, {
        ...textOptions,
        lineHeightFactor: 1.18,
      });
    this.doc
      .setFont('gilroy', 'normal', 'normal')
      .setFontSize(14)
      .text(t('Store this document in a safe place.'), 135, 84, textOptions);

    this.doc
      .setFont('gilroy', 'normal', 'bold')
      .setFontSize(16)
      .text(date.join('.'), 568, 75, {
        ...textOptions,
        align: 'right',
        lineHeightFactor: 1.18,
      });
    return this;
  }

  renderInstructions() {
    const { t } = this.props;
    const textOptions = this.textOptions;

    this.doc.addImage(printer, 'PNG', 32, 185, 36, 36);
    this.doc.addImage(usbStick, 'PNG', 32, 229, 36, 36);

    this.doc.setFont('gilroy', 'normal', 'bold').setFontSize(14);
    this.doc.text(t('How we recommend to store it.'), 32, 147, textOptions);
    this.doc.text(t('Print it on paper and store it in a safe place'), 76, 194, textOptions);
    this.doc.text(
      t('Save it on an encrypted hard drive: USB key or a backup drive'),
      76,
      238,
      textOptions
    );
    return this;
  }

  renderAccount() {
    const { t, passphrase } = this.props;
    const textOptions = this.textOptions;
    const address = extractAddressFromPassphrase(passphrase);

    this.doc
      .setFont('gilroy', 'normal', 'bold')
      .setFontSize(14)
      .text(t('Wallet address:'), 32, 300, textOptions);
    this.doc
      .setFont('gilroy', 'normal', 'bold')
      .setFontSize(18)
      .text(address, 32, 340, {
        ...textOptions,
        lineHeightFactor: 2.22,
      });

    this.doc
      .setFont('gilroy', 'normal', 'bold')
      .setFontSize(14)
      .text(t('Passphrase:'), 32, 406, textOptions);
    this.doc
      .setFont('gilroy', 'normal', 'bold')
      .setFontSize(18)
      .text(this.passphrase, 32.5, 464, {
        ...textOptions,
        align: 'justify',
        lineHeightFactor: 2,
      });

    this.doc
      .setFillColor('#BEC1CD')
      .rect(32, 443.5, 530, 1, 'F')
      .rect(32, 464 + this.passphrase.length * 40, 530, 1, 'F');
    return this;
  }

  renderFooter() {
    const { qrcode, t } = this.props;
    const textOptions = this.textOptions;
    const marginTop = this.passphrase.length * 45;
    this.doc.setFont('gilroy', 'normal', 'bold').setFontSize(14);
    this.doc.text(
      t('Access your account by scanning the QR code below with the Lisk Mobile App:'),
      32,
      495 + marginTop,
      textOptions
    );
    this.doc.addImage(qrcode, 'PNG', 240, 564 + marginTop, 120, 120);
    return this;
  }

  save(walletName) {
    this.renderHeader()
      .renderInstructions()
      .renderAccount()
      .renderFooter()
      .doc.save(`${walletName}`);
  }
}

const renderPaperWallet = (JSPDF, data, walletName) => {
  const pdf = new PaperWallet(JSPDF, data);
  pdf.save(walletName);
  return pdf.doc;
};

export default renderPaperWallet;

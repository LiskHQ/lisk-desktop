/* istanbul ignore file */
import JSPDF from 'jspdf';
import logo from '../assets/images/paperwallet/lisk-logo-blue-on-white-rgb.png';
import usbStick from '../assets/images/paperwallet/usb-stick.png';
import printer from '../assets/images/paperwallet/print.png';
import fonts from './paperwalletFonts';

class Paperwallet {
  constructor(props) {
    this.doc = new JSPDF({
      orientation: 'p',
      unit: 'pt',
      format: [600, 845],
    });
    this.props = props;

    this.setupDoc();
  }

  setupDoc() {
    const { account } = this.props;
    let line = -1;
    this.passphrase = account.passphrase.split(/\s/)
      .reduce((acc, word, index) => {
        line += index % 6 === 0 ? 1 : 0;
        acc[line] = acc[line] ? `${acc[line]} ${word}` : word;
        return acc;
      }, []);

    this.textOptions = {
      align: 'left',
      baseline: 'bottom',
      charSpace: 0.1,
    };

    this.doc.addFileToVFS('gilroy-bold.ttf', fonts.GilroyBold)
      .addFont('gilroy-bold.ttf', 'gilroy', 'bold');
    this.doc.addFileToVFS('gilroy-medium.ttf', fonts.GilroyMedium)
      .addFont('gilroy-medium.ttf', 'gilroy', 'normal');
    this.doc.setTextColor('#303030').setFont('gilroy');
  }

  renderHeader() {
    const { t, passphraseName } = this.props;
    const now = new Date(Date.now());
    const date = [
      `0${now.getDate()}`.substr(-2),
      `0${now.getMonth() + 1}`.substr(-2),
      `${now.getFullYear()}`,
    ];

    this.doc.addImage(logo, 'PNG', 65, 55, 50, 19);

    this.doc.setFontStyle('bold').setFontSize(12)
      .text(t('{{passphraseName}} paper wallet', { passphraseName }), 150, 65, this.textOptions);
    this.doc.setFontStyle('normal').setFontSize(10)
      .text(t('Store this document in a safe place.'), 150, 80, this.textOptions);

    this.doc.setFontStyle('bold').setFontSize(12)
      .text(date.join('.'), 545, 70, {
        ...this.textOptions,
        align: 'right',
      });
    return this;
  }

  renderInstructions() {
    const { t } = this.props;
    const textOptions = this.textOptions;

    this.doc.addImage(printer, 'PNG', 65, 150, 27, 27);
    this.doc.addImage(usbStick, 'PNG', 65, 185, 27, 27);

    this.doc.setFontStyle('normal').setFontSize(10);
    this.doc.text(t('How we recommend to store it'), 65, 130, textOptions);
    this.doc.text(t('Print it on paper and store it in a safe place'), 97, 167, textOptions);
    this.doc.text(t('Save it on a encrypted hard drive: USB key or a backup drive'), 97, 202, textOptions);
    return this;
  }

  renderAccount() {
    const { account, t, passphraseName } = this.props;
    const textOptions = this.textOptions;

    this.doc.setFontStyle('normal').setFontSize(10)
      .text(t('Wallet address:'), 65, 250, textOptions);
    this.doc.setFontStyle('bold').setFontSize(14)
      .text(account.address, 65, 280, textOptions);

    this.doc.setFontStyle('normal').setFontSize(10)
      .text(t('Passphrase:', { passphraseName }), 65, 330, textOptions);
    this.doc.setFontStyle('bold').setFontSize(18)
      .text(this.passphrase, 65, 385, {
        ...textOptions,
        lineHeightFactor: 2,
      });

    this.doc.setFillColor('#BEC1CD')
      .rect(65, 350, 470, 1, 'F')
      .rect(65, (350 + (this.passphrase.length * 45)), 470, 1, 'F');
    return this;
  }

  renderFooter() {
    const { qrcode, t } = this.props;
    const textOptions = this.textOptions;
    const marginTop = this.passphrase.length * 45;
    this.doc.setFontSize(10).setFontStyle('normal');
    this.doc.text(t('Access your account by scanning the QR code below with the Lisk Mobile App:'), 65, 400 + marginTop, textOptions);
    this.doc.addImage(qrcode, 'PNG', 240, 420 + marginTop, 120, 120);
    return this;
  }

  save(walletName) {
    this.renderHeader()
      .renderInstructions()
      .renderAccount()
      .renderFooter()
      .doc.save(`${walletName}.pdf`);
  }
}

const renderPaperwallet = (data, walletName) => {
  const pdf = new Paperwallet(data);
  pdf.save(walletName);
};

export default renderPaperwallet;

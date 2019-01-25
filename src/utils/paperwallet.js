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
    const { t } = this.props;
    const textOptions = {
      ...this.textOptions,
      align: 'center',
    };
    const now = new Date(Date.now());
    const date = [
      `0${now.getDate()}`.substr(-2),
      `0${now.getMonth() + 1}`.substr(-2),
      `${now.getFullYear()}`,
    ];

    this.doc.addImage(logo, 'PNG', 65, 55, 50, 19);

    this.doc.setFontStyle('bold').setFontSize(12)
      .text(t('Lisk passphrase backup'), 300, 65, textOptions);
    this.doc.setFontStyle('normal').setFontSize(10)
      .text(t('Keep this safe, never throw it away or share it with anyone.'), 300, 80, textOptions);

    this.doc.setFontStyle('bold').setFontSize(12)
      .text(date.join('.'), 545, 70, {
        ...textOptions,
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
    this.doc.text(t('How we recommend to store your passphrase.'), 65, 130, textOptions);
    this.doc.text(t('Print more than one copy and store them in two separate secure places.'), 97, 167, textOptions);
    this.doc.text(t('Save your passphrase on an encrypted hard drive.'), 97, 202, textOptions);
    return this;
  }

  renderAccount() {
    const { account, t } = this.props;
    const textOptions = this.textOptions;

    this.doc.setFontStyle('normal').setFontSize(10)
      .text(t('Address'), 65, 250, textOptions);
    this.doc.setFontStyle('bold').setFontSize(14)
      .text(account.address, 65, 280, textOptions);

    this.doc.setFontStyle('normal').setFontSize(10)
      .text([
        t('Your passphrase.'),
        t('This allows you to manually access your Lisk account.'),
      ], 65, 330, textOptions);
    this.doc.setFontStyle('bold').setFontSize(18)
      .text(this.passphrase, 300, 395, {
        ...textOptions,
        align: 'center',
        lineHeightFactor: 2.22,
      });

    this.doc.setFillColor('#000000')
      .rect(65, 360, 470, 1, 'F')
      .rect(65, (360 + (this.passphrase.length * 45)), 470, 1, 'F');
    return this;
  }

  renderFooter() {
    const { qrcode, t } = this.props;
    const textOptions = this.textOptions;
    const marginTop = this.passphrase.length * 45;
    this.doc.setFontSize(10).setFontStyle('normal');
    this.doc.text(t('Scan this QR code using the Lisk Mobile app to access your Lisk account.'), 65, 410 + marginTop, textOptions);
    this.doc.addImage(qrcode, 'PNG', 240, 430 + marginTop, 120, 120);
    return this;
  }

  save() {
    this.renderHeader()
      .renderInstructions()
      .renderAccount()
      .renderFooter()
      .doc.output('dataurlnewwindow');
    // .doc.save('Lisk.pdf');
  }
}

const renderPaperwallet = (data) => {
  const pdf = new Paperwallet(data);
  pdf.save();
};

export default renderPaperwallet;

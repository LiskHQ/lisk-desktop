import JSPDF from 'jspdf';
import logo from '../../assets/images/paperwallet/lisk-logo-blue-on-white-rgb.png';
import usbStick from '../../assets/images/paperwallet/usb-stick.png';
import printer from '../../assets/images/paperwallet/print.png';
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
    this.textOptions = {
      align: 'left',
      baseline: 'bottom',
      charSpace: 0.1,
    };
    this.doc.addFileToVFS('gilroy-bold.ttf', fonts.GilroyBold);
    this.doc.addFileToVFS('gilroy-medium.ttf', fonts.GilroyMedium);
    this.doc.addFont('gilroy-bold.ttf', 'gilroy', 'bold');
    this.doc.addFont('gilroy-medium.ttf', 'gilroy', 'normal');
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

    this.doc.addImage(logo, 'PNG', 50, 40, 50, 19);

    this.doc.setFontStyle('bold').setFontSize(12);
    this.doc.text(t('Lisk passphrase backup'), 300, 50, textOptions);
    this.doc.text(date.join('.'), 550, 55, {
      ...textOptions,
      align: 'right',
    });

    this.doc.setFontStyle('normal').setFontSize(10);
    this.doc.text(t('Keep it safe. Never throw it away'), 300, 65, textOptions);
  }

  renderInstructions() {
    const { t } = this.props;
    const textOptions = this.textOptions;

    this.doc.addImage(printer, 'PNG', 50, 135, 27, 27);
    this.doc.addImage(usbStick, 'PNG', 50, 170, 27, 27);

    this.doc.setFontStyle('normal').setFontSize(10);
    this.doc.text(t('How we recommend to store it'), 50, 115, textOptions);
    this.doc.text(t('Print it on paper and keep it secure'), 82, 152, textOptions);
    this.doc.text(t('Save it on a encrypted hard drive: USB key or a backup drive'), 82, 187, textOptions);
  }

  renderAccount() {
    const { account, t } = this.props;
    const textOptions = this.textOptions;

    this.doc.setFontStyle('normal').setFontSize(10);
    this.doc.text(t('Address'), 50, 250, textOptions);
    this.doc.text(t('Passphrase. Use it to access your Lisk account manually'), 50, 320, textOptions);

    this.doc.setFontStyle('bold').setFontSize(14);
    this.doc.text(account.address, 50, 280, textOptions);
  }

  renderPDF() {
    this.renderHeader();
    this.renderInstructions();
    this.renderAccount();
  }

  save() {
    this.renderPDF();
    this.doc.output('dataurlnewwindow');
    // this.doc.save('lisk.pdf');
  }
}

export default Paperwallet;

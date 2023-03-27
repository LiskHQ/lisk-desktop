import React from 'react';
import { TertiaryButton } from 'src/theme/buttons';
import PassphraseRenderer from '@wallet/components/passphraseRenderer';
import CopyToClipboard from 'src/modules/common/components/copyToClipboard';
import Icon from 'src/theme/Icon';
import styles from './passphraseBackup.css';

class PassphraseBackup extends React.Component {
  constructor(props) {
    super();
    this.state = {
      showTip: false,
    };

    this.walletName = `${props.paperWalletName}.pdf`;
    this.setCanvasRef = this.setCanvasRef.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  setCanvasRef(node) {
    this.canvasRef = node;
  }

  handleClick() {
    this.setState({ showTip: true });
    setTimeout(() => {
      this.setState({ showTip: false });
    }, 3000);
  }

  render() {
    const { t, passphrase } = this.props;

    return (
      <>
        <div className={`${styles.optionsHolder}`}>
          <div className={`${styles.option}`}>
            <div className={`${styles.optionContent}`}>
              <PassphraseRenderer showInfo passphrase={passphrase} subheader />
              <CopyToClipboard
                onClick={this.handleClick}
                value={passphrase}
                text={t('Copy')}
                Container={TertiaryButton}
                containerProps={{ size: 'xs', className: styles.copyPassphrase }}
                copyClassName={styles.copyIcon}
              />
              <div className={styles.copyButtonContainer}>
                <span
                  className={[
                    'tip',
                    styles.tipContainer,
                    !this.state.showTip && styles.hidden,
                  ].join(' ')}
                >
                  <Icon color="red" name="warningRound" />
                  <p>{t('Make sure to store it somewhere safe')}</p>
                </span>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default PassphraseBackup;

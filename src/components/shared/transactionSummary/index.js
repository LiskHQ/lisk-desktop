import React, { useEffect, useState } from 'react';
import { extractPublicKey } from '@utils/account';
import { formatAmountBasedOnLocale } from '@utils/formattedNumber';
import { PrimaryButton, SecondaryButton } from '@toolbox/buttons';
import Box from '@toolbox/box';
import BoxHeader from '@toolbox/box/header';
import BoxContent from '@toolbox/box/content';
import BoxFooter from '@toolbox/box/footer';
import CheckBox from '@toolbox/checkBox';
import HardwareWalletIllustration from '@toolbox/hardwareWalletIllustration';
import PassphraseInput from '@toolbox/passphraseInput';
import Tooltip from '@toolbox/tooltip/tooltip';
import copyToClipboard from 'copy-to-clipboard';
import Icon from '@toolbox/icon';
import styles from './transactionSummary.css';

const Footer = ({
  confirmButton, cancelButton, footerClassName, showCancelButton,
  isHardwareWalletConnected, confirmation, isConfirmed,
  account, secondPassphrase, t, transaction, createTransaction,
}) => {
  account.summary.isMultisignature = true;
  if (isHardwareWalletConnected) {
    return null;
  }
  const [download, setDownload] = useState(false);
  const [isCopy, setIsCopy] = useState(false);
  const onDownload = () => {
    const anchor = document.createElement('a');
    anchor.setAttribute('href', `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(transaction))}`);
    anchor.setAttribute('download', `tx-${transaction.moduleID}-${transaction.assetID}.json`);
    anchor.click();
  };

  useEffect(() => {
    if (account.summary.isMultisignature) {
      if (download) {
        onDownload();
        setDownload(false);
      }
      if (isCopy) {
        copyToClipboard(JSON.stringify(transaction));
        setIsCopy(false);
      }
    }
  }, [transaction]);

  return (
    <BoxFooter className={`${footerClassName} summary-footer`} direction="horizontal">
      {account.summary.isMultisignature ? (
        <>
          <SecondaryButton onClick={() => {
            setIsCopy(true);
            createTransaction();
          }}
          >
            <span className={styles.buttonContent}>
              <Icon name="copy" />
              {t('copy')}
            </span>
          </SecondaryButton>
          <PrimaryButton onClick={() => {
            setDownload(true);
            createTransaction();
          }}
          >
            <span className={styles.buttonContent}>
              <Icon name="download" />
              {t('Download')}
            </span>
          </PrimaryButton>
        </>
      ) : (
        <>
          {showCancelButton && (
            <SecondaryButton
              className={`${styles.editBtn} cancel-button`}
              onClick={cancelButton.onClick}
            >
              {cancelButton.label}
            </SecondaryButton>
          )}
          <PrimaryButton
            className={`${styles.confirmBtn} confirm-button`}
            disabled={
              (!!account.secondPublicKey && !secondPassphrase.isValid)
              || (confirmation && !isConfirmed)
              || confirmButton.disabled
            }
            onClick={confirmButton.onClick}
          >
            {confirmButton.label}
          </PrimaryButton>
        </>
      )}
    </BoxFooter>
  );
};

class TransactionSummary extends React.Component {
  constructor(props) {
    super(props);
    const { account } = props;

    this.state = {
      isHardwareWalletConnected: !!(account.hwInfo && account.hwInfo.deviceId),
      secondPassphrase: {
        isValid: false,
        feedback: '',
        value: null,
      },
    };
    this.checkSecondPassphrase = this.checkSecondPassphrase.bind(this);
    this.confirmOnClick = this.confirmOnClick.bind(this);
    this.onConfirmationChange = this.onConfirmationChange.bind(this);
    this.getTooltip = this.getTooltip.bind(this);
  }

  componentDidMount() {
    const { isHardwareWalletConnected } = this.state;
    const { confirmButton } = this.props;

    if (isHardwareWalletConnected && !confirmButton.disabled) {
      this.confirmOnClick();
    }
  }

  componentDidUpdate(prevProps) {
    const { isHardwareWalletConnected } = this.state;
    const { confirmButton } = this.props;
    if (isHardwareWalletConnected && prevProps.confirmButton.disabled && !confirmButton.disabled) {
      this.confirmOnClick();
    }
  }

  checkSecondPassphrase(passphrase, error) {
    const { account, t } = this.props;
    const expectedPublicKey = !error && extractPublicKey(passphrase);
    const isPassphraseValid = account.secondPublicKey === expectedPublicKey;
    const feedback = !error && !isPassphraseValid ? t('Oops! Wrong passphrase') : '';

    this.setState({
      secondPassphrase: {
        ...this.state.secondPassphrase,
        isValid: !error && feedback === '' && passphrase !== '',
        feedback,
        value: passphrase,
      },
    });
  }

  confirmOnClick() {
    this.props.confirmButton.onClick({
      secondPassphrase: this.state.secondPassphrase.value,
    });
  }

  onConfirmationChange() {
    this.setState({
      isConfirmed: !this.state.isConfirmed,
    });
  }

  getTooltip() {
    const { t, token } = this.props;
    return {
      LSK: {
        title: t('Transaction fee'),
        children: t(`Every transaction needs to be confirmed and forged into Lisk blockchain network. 
                    Such operations require hardware resources and because of that there is a small fee for processing those.`),
      },
      BTC: {
        children: t('Bitcoin transactions are made with some delay that depends on two parameters: the fee and the bitcoin network’s congestion. The higher the fee, the higher the processing speed.'),
      },
    }[token];
  }

  render() {
    const {
      title, children, confirmButton, cancelButton, account, transaction, createTransaction,
      t, fee, confirmation, classNames, token, footerClassName, showCancelButton = true,
    } = this.props;
    const {
      secondPassphrase, isHardwareWalletConnected, isConfirmed,
    } = this.state;

    const tooltip = this.getTooltip();

    return (
      <Box width="medium" className={`${styles.wrapper} ${classNames} summary`}>
        {title && (
          <BoxHeader className="summary-header">
            <h2>
              {title}
              {isHardwareWalletConnected ? t(' - Confirm transaction on your {{deviceModel}}', { deviceModel: account.hwInfo.deviceModel }) : ''}
            </h2>
          </BoxHeader>
        )}
        <BoxContent className={`${styles.content} summary-content`}>
          <HardwareWalletIllustration account={account} size="s" />
          {children}
          {fee && (
            <section>
              <label>
                {t('Transaction fee')}
                <Tooltip title={tooltip.title} footer={tooltip.footer} position="right">
                  <p className={styles.tooltipText}>{tooltip.children}</p>
                </Tooltip>
              </label>
              <label className={`${styles.feeValue} fee-value`}>
                {`${formatAmountBasedOnLocale({ value: fee })} ${token}`}
              </label>
            </section>
          )}
          {
        confirmation
          ? (
            <label className={styles.checkboxLabel}>
              <CheckBox
                checked={isConfirmed}
                onChange={this.onConfirmationChange}
                className={`${styles.checkbox} confirmation-checkbox`}
              />
              {confirmation}
            </label>
          )
          : null
      }
          {
        account.secondPublicKey
          ? (
            <section className={`${styles.tooltipContainer} summary-second-passphrase`}>
              <label>
                {t('Second passphrase')}
                <Tooltip
                  position="right"
                  className={`${styles.tooltip}`}
                  title={t('What is your second passphrase?')}
                >
                  <>
                    <p className={`${styles.tooltupText}`}>
                      {t('Second passphrase is an optional extra layer of protection to your account. You can register at anytime, but you can not remove it.')}
                    </p>
                    <p className={`${styles.tooltipText}`}>
                      {t('If you see this field, you have registered a second passphrase in past and it is required to confirm transactions.')}
                    </p>
                  </>
                </Tooltip>
              </label>
              <PassphraseInput
                isSecondPassphrase={!!account.secondPublicKey}
                secondPPFeedback={secondPassphrase.feedback}
                inputsLength={12}
                maxInputsLength={24}
                onFill={this.checkSecondPassphrase}
              />
            </section>
          )
          : null
      }
        </BoxContent>
        <Footer
          confirmButton={confirmButton}
          cancelButton={cancelButton}
          footerClassName={footerClassName}
          showCancelButton={showCancelButton}
          isHardwareWalletConnected={isHardwareWalletConnected}
          confirmation={confirmation}
          isConfirmed={isConfirmed}
          account={account}
          secondPassphrase={secondPassphrase}
          transaction={transaction}
          createTransaction={createTransaction}
          t={t}
        />
      </Box>
    );
  }
}

TransactionSummary.defaultProps = {
  token: 'LSK',
};

export default TransactionSummary;

import React from 'react';
import { regex } from 'src/const/regex';
import { maxMessageLength } from '@transaction/configuration/transactions';
import { mockAppTokens } from '@tests/fixtures/token';
import { validateAmountFormat } from 'src/utils/validators';
import { sizeOfString } from 'src/utils/helpers';
import { Input } from 'src/theme';
import blockchainApplicationsExplore from '@tests/fixtures/blockchainApplicationsExplore';
import Converter from 'src/modules/common/components/converter';
import { useCurrentAccount } from 'src/modules/account/hooks';
import i18n from 'src/utils/i18n/i18n';
import Div from '@common/components/div/Div';
import MessageField from '../../../token/fungible/components/MessageField';
import MenuSelect, { MenuItem } from '../MenuSelect';
import RequestWrapper from './requestWrapper';
import styles from './request.css';
import WalletVisual from '../walletVisual';
import chainLogo from '../../../../../setup/react/assets/images/LISK.png';

const Account = () => {
  const [currentAccount] = useCurrentAccount();
  const { address, name } = currentAccount.metadata || {};

  return (
    <div className={styles.accountWrapper}>
      <WalletVisual address={address} size={40} />
      <div>
        <b className={`${styles.addressValue}`}>{name}</b>
        <p className={`${styles.addressValue}`}>{address}</p>
      </div>
    </div>
  );
};

class Request extends React.Component {
  constructor(props) {
    super();

    this.state = {
      shareLink: `lisk://wallet/send?recipient=${props.address}`,
      fields: {
        amount: {
          error: false,
          value: '',
          loading: false,
          feedback: '',
        },
        reference: {
          error: false,
          value: '',
          loading: false,
          feedback: '',
        },
        token: {
          error: false,
          value: '',
          loading: false,
          feedback: '',
        },
        recipientApplication: {
          error: false,
          value: '',
          loading: false,
          feedback: '',
        },
      },
    };

    this.timeout = {
      amount: null,
      reference: null,
    };

    this.handleFieldChange = this.handleFieldChange.bind(this);
    this.updateShareLink = this.updateShareLink.bind(this);
    this.onSelectReceipentChain = this.onSelectReceipentChain.bind(this);
    this.onSelectToken = this.onSelectToken.bind(this);
    this.onRemoveMessageField = this.onRemoveMessageField.bind(this);
  }

  /* istanbul ignore next */
  componentWillUnmount() {
    clearTimeout(this.timeout.amount);
    clearTimeout(this.timeout.reference);
  }

  // eslint-disable-next-line max-statements
  handleFieldChange({ target }) {
    const { t } = this.props;
    const byteCount = sizeOfString(target.value);
    const error =
      target.name === 'amount'
        ? validateAmountFormat({ value: target.value, locale: i18n.language }).message
        : byteCount > maxMessageLength;
    let feedback = '';

    if (target.name === 'amount') {
      const { leadingPoint } = regex.amount[i18n.language];
      target.value = leadingPoint.test(target.value) ? `0${target.value}` : target.value;
      feedback = error || feedback;
    } else if (target.name === 'reference' && byteCount > 0) {
      feedback = t('{{length}} bytes left', { length: maxMessageLength - byteCount });
    }

    const field = {
      [target.name]: {
        error: !!error,
        value: target.value,
        feedback,
        loading: true,
      },
    };

    const shareLink = this.updateShareLink(field);

    this.setState({
      shareLink,
      fields: {
        ...this.state.fields,
        ...field,
      },
    });

    clearTimeout(this.timeout[target.name]);
    this.timeout[target.name] = setTimeout(() => {
      field[target.name].loading = false;
      this.setState({
        shareLink,
        fields: {
          ...this.state.fields,
          ...field,
        },
      });
    }, 300);
  }

  updateShareLink(newField) {
    const fields = {
      ...this.state.fields,
      ...newField,
    };
    const { address } = this.props;
    return Object.keys(fields).reduce((link, fieldName) => {
      const field = fields[fieldName];
      return field.value !== '' ? `${link}&${fieldName}=${encodeURIComponent(field.value)}` : link;
    }, `lisk://wallet/send?recipient=${address}`);
  }

  // TODO: this would be properly implemented when apis have been hooked up
  onSelectReceipentChain(value) {
    this.handleFieldChange({
      target: {
        name: 'recipientApplication',
        value,
      },
    });
  }

  // TODO: this would be properly implemented when apis have been hooked up
  onSelectToken(value) {
    this.handleFieldChange({
      target: {
        name: 'token',
        value,
      },
    });
  }

  onRemoveMessageField() {
    this.handleFieldChange({
      target: {
        name: 'reference',
        value: '',
      },
    });
  }

  // eslint-disable-next-line complexity
  render() {
    const { t } = this.props;
    const { fields, shareLink } = this.state;

    return (
      <RequestWrapper
        copyLabel={t('Copy link')}
        copyValue={shareLink}
        t={t}
        title={t('Request tokens')}
        className="request-wrapper"
      >
        <span className={`${styles.label}`}>
          {t(
            'Use the sharing link to easily request any amount of tokens from Lisk Desktop or Lisk Mobile users.'
          )}
        </span>

        <p>Account</p>
        <Account />
        <label className={`${styles.fieldGroup} recipient-application`}>
          <span className={`${styles.fieldLabel}`}>{t('Recipient Application')}</span>
          <span className={`${styles.amountField}`}>
            <MenuSelect
              className="recipient-chain-select"
              value={fields.recipientApplication.value}
              onChange={this.onSelectReceipentChain}
            >
              {blockchainApplicationsExplore.map(({ name, chainID }) => (
                <MenuItem className={styles.chainOptionWrapper} value={chainID} key={chainID}>
                  <img className={styles.chainLogo} src={chainLogo} />
                  <span>{name}</span>
                </MenuItem>
              ))}
            </MenuSelect>
          </span>
        </label>
        <label className={`${styles.fieldGroup} token`}>
          <span className={`${styles.fieldLabel}`}>{t('Token')}</span>
          <span className={`${styles.amountField}`}>
            <MenuSelect
              className="token-select"
              onChange={this.onSelectToken}
              value={fields.token.value}
            >
              {mockAppTokens.map(({ name, tokenID }) => (
                <MenuItem className={styles.chainOptionWrapper} value={tokenID} key={tokenID}>
                  <img className={styles.chainLogo} src={chainLogo} />
                  <span>{name}</span>
                </MenuItem>
              ))}
            </MenuSelect>
          </span>
        </label>
        <label className={`${styles.fieldGroup}`}>
          <span className={`${styles.fieldLabel}`}>{t('Amount')}</span>
          <span className={`${styles.amountField} amount`}>
            <Input
              autoComplete="off"
              onChange={this.handleFieldChange}
              name="amount"
              value={fields.amount.value}
              placeholder={t('Requested amount')}
              className={`${styles.input} amount-field`}
              status={fields.amount.error ? 'error' : 'ok'}
              feedback={fields.amount.feedback}
              isLoading={fields.amount.loading}
              size="m"
            />
            <Converter
              Wrapper={Div}
              className={styles.converter}
              value={fields.amount.value}
              error={fields.amount.error}
            />
          </span>
        </label>
        <MessageField
          t={t}
          name="reference"
          reference={fields.reference.value}
          onChange={this.handleFieldChange}
          maxMessageLength={maxMessageLength}
          isLoading={fields.reference.loading}
          error={fields.reference.error}
          feedback={fields.reference.feedback}
          label={t('Message (Optional)')}
          placeholder={t('Write message')}
          onRemove={this.onRemoveMessageField}
        />
      </RequestWrapper>
    );
  }
}

export default Request;

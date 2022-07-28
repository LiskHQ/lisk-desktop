import React from 'react';
import { regex } from 'src/const/regex';
import { maxMessageLength } from '@transaction/configuration/transactions';
import { validateAmountFormat } from 'src/utils/validators';
import { sizeOfString } from 'src/utils/helpers';
import { Input, AutoResizeTextarea } from 'src/theme';
import CircularProgress from '@theme/ProgressCircular/circularProgress';
import Converter from 'src/modules/common/components/converter';
import { useCurrentAccount } from 'src/modules/account/hooks';
import Icon from '@theme/Icon';
import i18n from 'src/utils/i18n/i18n';
import MenuSelect, { MenuItem } from '../MenuSelect';
import RequestWrapper from './requestWrapper';
import styles from './request.css';
import WalletVisual from '../walletVisual';

const Account = () => {
  const [currentAccount] = useCurrentAccount();
  const { address, name } = currentAccount.metadata || {};

  return (
    <div className={styles.accountWraper}>
      <WalletVisual address={address} size={40} />
      <div align="left">
        <b className={`${styles.addressValue}`}>
          {name}
        </b>
        <p className={`${styles.addressValue}`}>
          {address}
        </p>
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
      },
    };

    this.timeout = {
      amount: null,
      reference: null,
    };

    this.handleFieldChange = this.handleFieldChange.bind(this);
    this.updateShareLink = this.updateShareLink.bind(this);
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
    const error = target.name === 'amount'
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
      return field.value !== ''
        ? `${link}&${fieldName}=${encodeURIComponent(field.value)}`
        : link;
    }, `lisk://wallet/send?recipient=${address}`);
  }

  onSelectReceipentChain(value) {
    console.log('----', this.props, value);
  }

  // eslint-disable-next-line complexity
  render() {
    const { t } = this.props;
    const { fields, shareLink } = this.state;
    const byteCount = sizeOfString(fields.reference.value);

    return (
      <RequestWrapper copyLabel={t('Copy link')} copyValue={shareLink} t={t} title={t('Request tokens')}>
        <span className={`${styles.label}`}>
          {t('Use the sharing link to easily request any amount of tokens from Lisk Hub or Lisk Mobile users.')}
        </span>

        <p>Account</p>
        <Account />
        <label className={`${styles.fieldGroup}`}>
          <span className={`${styles.fieldLabel}`}>{t('Recipient Application')}</span>
          <span className={`${styles.amountField}`}>
            <MenuSelect showDropdown showArrow>
              <MenuItem value={23}>
                <span> (._.) jskdjfs</span>
              </MenuItem>
              <MenuItem value={2323}>
                <span> (._.)-- asdfasdf</span>
              </MenuItem>
            </MenuSelect>
          </span>
        </label>
        <label className={`${styles.fieldGroup}`}>
          <span className={`${styles.fieldLabel}`}>{t('Token')}</span>
          <span className={`${styles.amountField}`}>
            <MenuSelect showDropdown showArrow>
              <MenuItem value={23}>
                <span> (._.) jskdjfs</span>
              </MenuItem>
              <MenuItem value={2323}>
                <span> (._.)-- asdfasdf</span>
              </MenuItem>
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
              className={styles.input}
              status={fields.amount.error ? 'error' : 'ok'}
              feedback={fields.amount.feedback}
              isLoading={fields.amount.loading}
              size="s"
            />
            <Converter
              className={styles.converter}
              value={fields.amount.value}
              error={fields.amount.error}
            />
          </span>
        </label>
        <label className={`${styles.fieldGroup} reference`}>
          <span className={`${styles.fieldLabel}`}>{t('Message (optional)')}</span>
          <span className={`${styles.referenceField}`}>
            <AutoResizeTextarea
              maxLength={100}
              spellCheck={false}
              onChange={this.handleFieldChange}
              name="reference"
              value={fields.reference.value}
              placeholder={t('Write message')}
              className={`${styles.textarea} ${fields.reference.error ? 'error' : ''}`}
            />
            <CircularProgress
              max={maxMessageLength}
              value={byteCount}
              className={styles.byteCounter}
            />
            <Icon
              className={`${styles.status} ${!fields.reference.loading && fields.reference.value ? styles.show : ''}`}
              name={fields.reference.error ? 'alertIcon' : 'okIcon'}
            />
            <span className={`${styles.feedback} ${maxMessageLength - byteCount < 10 ? styles.error : ''}`}>
              {fields.reference.feedback}
            </span>
          </span>
        </label>
      </RequestWrapper>
    );
  }
}

export default Request;

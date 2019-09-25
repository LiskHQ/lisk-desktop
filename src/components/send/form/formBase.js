import React from 'react';
import numeral from 'numeral';
import { Input } from '../../toolbox/inputs';
import { PrimaryButton, TertiaryButton } from '../../toolbox/buttons/button';
import { formatAmountBasedOnLocale } from '../../../utils/formattedNumber';
import { fromRawLsk } from '../../../utils/lsk';
import { parseSearchParams } from '../../../utils/searchParams';
import { validateAmountFormat } from '../../../utils/validators';
import BookmarkAutoSuggest from './bookmarkAutoSuggest';
import Box from '../../toolbox/box';
import Converter from '../../converter';
import Piwik from '../../../utils/piwik';
import Tooltip from '../../toolbox/tooltip/tooltip';
import i18n from '../../../i18n';
import links from '../../../constants/externalLinks';
import regex from '../../../utils/regex';
import styles from './form.css';

class FormBase extends React.Component {
  constructor(props) {
    super(props);
    const { prevState } = props;
    const { recipient = '', amount } = parseSearchParams(props.history.location.search);

    this.state = {
      isLoading: false,
      fields: {
        recipient: {
          address: recipient,
          value: recipient,
          error: false,
          feedback: '',
          selected: false,
          title: '',
        },
        amount: amount ? {
          ...this.getAmountFeedbackAndError(amount, props),
          value: amount,
        } : {
          error: false,
          value: '',
          feedback: '',
        },
        ...(prevState && prevState.fields ? {
          amount: prevState.fields.amount,
          recipient: prevState.fields.recipient,
        } : {}),
      },
    };

    this.loaderTimeout = null;

    this.onAmountChange = this.onAmountChange.bind(this);
    this.onGoNext = this.onGoNext.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
    this.updateField = this.updateField.bind(this);
    this.setEntireBalance = this.setEntireBalance.bind(this);
  }

  onInputChange({ target }) {
    const { fields } = this.state;
    const newState = {
      ...fields[target.name],
      value: target.value,
    };
    this.props.onInputChange({ target }, newState);
    this.updateField(target.name, newState);
  }

  updateAmountField(value) {
    const { leadingPoint } = regex.amount[i18n.language];
    value = leadingPoint.test(value) ? `0${value}` : value;

    this.updateField('amount', {
      ...this.getAmountFeedbackAndError(value),
      value,
    });
  }

  getMaxAmount() {
    const { account, fee } = this.props;
    return fromRawLsk(Math.max(0, account.balance - fee));
  }

  getAmountFeedbackAndError(value, props) {
    const { token, t } = (props || this.props);
    let { message: feedback } = validateAmountFormat({ value, token });

    if (!feedback && parseFloat(this.getMaxAmount()) < numeral(value).value()) {
      feedback = t('Provided amount is higher than your current balance.');
    }
    return { error: !!feedback, feedback };
  }

  setEntireBalance() {
    const { fee } = this.props;
    const value = formatAmountBasedOnLocale({
      value: this.getMaxAmount(),
      format: '0.[00000000]',
    });
    this.onAmountChange({ target: { value, name: 'amount' } });
    setTimeout(() => {
      if (fee !== this.props.fee) { // Because fee can change based on amount
        this.setEntireBalance();
      }
    }, 1);
  }

  updateField(name, value) {
    this.setState(({ fields }) => ({
      fields: {
        ...fields,
        [name]: {
          ...fields[name],
          ...value,
        },
      },
    }));
  }

  onAmountChange({ target }) {
    clearTimeout(this.loaderTimeout);

    this.setState(() => ({ isLoading: true }));
    this.loaderTimeout = setTimeout(() => {
      this.setState(() => ({ isLoading: false }));
      this.updateAmountField(target.value);
    }, 300);

    this.onInputChange({ target });
  }

  onGoNext() {
    const { nextStep, extraFields } = this.props;
    Piwik.trackingEvent('Send_Form', 'button', 'Next step');
    nextStep({
      fields: { ...extraFields, ...this.state.fields },
    });
  }

  render() {
    const { fields, isLoading } = this.state;
    const {
      t, token, children, extraFields, fee, networkConfig, bookmarks,
    } = this.props;
    const isSubmitButtonDisabled = !!(isLoading
      || Object.values(fields).find(({ error, value }) => error || value === '')
      || Object.values(extraFields).find(({ error }) => error)
    );
    return (
      <Box className={styles.wrapper} width="medium">
        <Box.Header>
          <h1>{ t('Send {{token}}', { token }) }</h1>
        </Box.Header>
        <Box.Content className={styles.formSection}>
          <span className={`${styles.fieldGroup} recipient`}>
            <span className={`${styles.fieldLabel}`}>{t('Recipient')}</span>
            <BookmarkAutoSuggest
              bookmarks={bookmarks[token]}
              networkConfig={networkConfig}
              recipient={fields.recipient}
              t={t}
              token={token}
              updateField={this.updateField}
            />
          </span>

          <label className={[
            styles.fieldGroup, fields.amount.error && styles.error,
          ].filter(Boolean).join(' ')}
          >
            <div className={`${styles.amountFieldHeader}`}>
              <span className={`${styles.fieldLabel}`}>{t('Amount')}</span>
              <TertiaryButton
                onClick={this.setEntireBalance}
                className="send-entire-balance-button"
                size="xs"
              >
                {t('Send entire balance')}
              </TertiaryButton>
            </div>
            <span className={`${styles.amountField} amount`}>
              <Input
                autoComplete="off"
                onChange={this.onAmountChange}
                name="amount"
                value={fields.amount.value}
                placeholder={t('Insert the amount of transaction')}
                className={`${styles.input} ${fields.amount.error ? 'error' : ''}`}
                isLoading={this.state.isLoading}
                status={fields.amount.error ? 'error' : 'ok'}
                feedback={fields.amount.feedback}
              />
              <Converter
                className={styles.converter}
                value={fields.amount.value}
                error={fields.amount.error}
              />
            </span>
            { !extraFields.processingSpeed ? (
              <span className={styles.amountHint}>
                {t('+ Transaction fee {{fee}} LSK', {
                  fee: formatAmountBasedOnLocale({ value: fromRawLsk(fee) }),
                })}
                <Tooltip
                  className="showOnTop"
                  title={t('Transaction fee')}
                  footer={(
                    <a
                      href={links.transactionFee}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      {t('Read more')}
                    </a>
)}
                >
                  <p className={styles.tooltipText}>
                    {
                    t(`Every transaction needs to be confirmed and forged into Lisk blockchain network. 
                    Such operations require hardware resources and because of that there is a small fee for processing those.`)
                  }
                  </p>
                </Tooltip>
              </span>
            ) : null }
          </label>
          { children }
        </Box.Content>
        <Box.Footer>
          <PrimaryButton
            className={`${styles.confirmButton} btn-submit send-next-button`}
            disabled={isSubmitButtonDisabled}
            onClick={this.onGoNext}
          >
            {t('Go to confirmation')}
          </PrimaryButton>
        </Box.Footer>
      </Box>
    );
  }
}

FormBase.defaultProps = {
  extraFields: {},
  onInputChange: () => {},
};

export default FormBase;

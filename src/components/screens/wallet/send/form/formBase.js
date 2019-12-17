import React from 'react';
import numeral from 'numeral';
import { PrimaryButton } from '../../../../toolbox/buttons/button';
import { formatAmountBasedOnLocale } from '../../../../../utils/formattedNumber';
import { fromRawLsk } from '../../../../../utils/lsk';
import { parseSearchParams } from '../../../../../utils/searchParams';
import { validateAmountFormat } from '../../../../../utils/validators';
import AmountField from './amountField';
import BookmarkAutoSuggest from './bookmarkAutoSuggest';
import Box from '../../../../toolbox/box';
import BoxContent from '../../../../toolbox/box/content';
import BoxFooter from '../../../../toolbox/box/footer';
import BoxHeader from '../../../../toolbox/box/header';
import Piwik from '../../../../../utils/piwik';
import i18n from '../../../../../i18n';
import regex from '../../../../../utils/regex';
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
    this.updateField = this.updateField.bind(this);
    this.setEntireBalance = this.setEntireBalance.bind(this);
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
    this.props.onInputChange({ target: { name, value: value.value } }, value);
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

    const { fields } = this.state;
    this.updateField(target.name, {
      ...fields[target.name],
      value: target.value,
    });
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
      || Object.values(fields).find(({ value }) => value === '')
      || Object.values({ ...extraFields, ...fields }).find(({ error }) => error)
    );
    return (
      <Box className={styles.wrapper} width="medium">
        <BoxHeader>
          <h1>{ t('Send {{token}}', { token }) }</h1>
        </BoxHeader>
        <BoxContent className={styles.formSection}>
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
          <AmountField
            t={t}
            amount={fields.amount}
            extraFields={extraFields}
            fee={extraFields.processingSpeed ? null : fee}
            setEntireBalance={this.setEntireBalance}
            onAmountChange={this.onAmountChange}
            isLoading={isLoading}
          />
          { children }
        </BoxContent>
        <BoxFooter>
          <PrimaryButton
            className={`${styles.confirmButton} btn-submit send-next-button`}
            disabled={isSubmitButtonDisabled}
            onClick={this.onGoNext}
          >
            {t('Go to confirmation')}
          </PrimaryButton>
        </BoxFooter>
      </Box>
    );
  }
}

FormBase.defaultProps = {
  extraFields: {},
  onInputChange: () => {},
};

export default FormBase;

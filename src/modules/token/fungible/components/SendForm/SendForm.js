import React, { useState } from 'react';
import Piwik from 'src/utils/piwik';
import { MODULE_ASSETS_NAME_ID_MAP } from '@transaction/configuration/moduleAssets';
import AmountField from 'src/modules/common/components/amountField';
import TokenAmount from '@token/fungible/components/tokenAmount';
import Icon from 'src/theme/Icon';
import { toRawLsk, fromRawLsk } from '@token/fungible/utils/lsk';
import BoxContent from 'src/theme/box/content';
import BoxHeader from 'src/theme/box/header';
import MenuSelect, { MenuItem } from 'src/modules/wallet/components/MenuSelect';
import TxComposer from '@transaction/components/TxComposer';
import BookmarkAutoSuggest from './bookmarkAutoSuggest';
import useAmountField from '../../hooks/useAmountField';
import useMessageField from '../../hooks/useMessageField';
import useRecipientField from '../../hooks/useRecipientField';
import styles from './form.css';
import MessageField from '../MessageField';

const getInitialData = (rawTx, initialValue) => rawTx?.asset.data || initialValue || '';
const getInitialAmount = (rawTx, initialValue) => (Number(rawTx?.asset.amount) ? fromRawLsk(rawTx?.asset.amount) : initialValue || '');
const getInitialRecipient = (rawTx, initialValue) => rawTx?.asset.recipient.address || initialValue || '';

const SendForm = (props) => {
  const {
    t,
    token,
    account = {},
    bookmarks,
    nextStep,
  } = props;

  const [reference, setReference] = useMessageField(
    getInitialData(props.prevState?.rawTx, props.initialValue?.reference),
  );
  const [amount, setAmountField] = useAmountField(
    getInitialAmount(
      props.prevState?.rawTx,
      props.initialValue?.amount,
    ),
    account.summary?.balance,
    token,
  );
  const [recipient, setRecipientField] = useRecipientField(
    getInitialRecipient(props.prevState?.rawTx, props.initialValue?.recipient),
  );
  const [maxAmount, setMaxAmount] = useState({ value: 0, error: false });

  const onComposed = (status) => {
    Piwik.trackingEvent('Send_Form', 'button', 'Next step');
    setMaxAmount(status.maxAmount);
  };

  const onConfirm = (rawTx) => {
    nextStep({ rawTx });
  };

  const isValid = [amount, recipient, reference].reduce((result, item) => {
    result = result && !item.error && (!item.required || item.value !== '');
    return result;
  }, true);

  const transaction = {
    isValid,
    moduleAssetId: MODULE_ASSETS_NAME_ID_MAP.transfer,
    asset: {
      recipient: {
        address: recipient.value,
        title: recipient.title,
      },
      amount: toRawLsk(amount.value),
      data: reference.value,
    },
  };

  return (
    <section className={styles.wrapper}>
      <TxComposer
        onComposed={onComposed}
        onConfirm={onConfirm}
        transaction={transaction}
      >
        <>
          <BoxHeader className={styles.header}>
            <h2>{t('Send Tokens')}</h2>
          </BoxHeader>
          <BoxContent className={styles.formSection}>
            <div className={`${styles.ApplilcationFieldWrapper}`}>
              <div>
                <label className={`${styles.fieldLabel} recipient-application`}>
                  <span>{t('Recipient Application')}</span>
                </label>
                <MenuSelect>
                  <MenuItem value={1}>
                    ******** 12
                  </MenuItem>
                  <MenuItem value={2}>
                    ******** 12
                  </MenuItem>
                </MenuSelect>
              </div>
              <div>
                <Icon name="transferArrow" />
              </div>
              <div>
                <label className={`${styles.fieldLabel} recipient-application`}>
                  <span>{t('Recipient Application')}</span>
                </label>
                <MenuSelect>
                  <MenuItem value={1}>
                    ******** 12
                  </MenuItem>
                  <MenuItem value={2}>
                    ******** 12
                  </MenuItem>
                </MenuSelect>
              </div>
            </div>

            <div className={`${styles.fieldGroup} token`}>
              <label className={`${styles.fieldLabel}`}>
                <span>{t('Recipient Application')}</span>
              </label>
              <span className={styles.balance}>
                Balance:&nbsp;
                <span>
                  <TokenAmount val={amount} />
                  {' '}
                  LSK
                </span>
              </span>
              <MenuSelect>
                <MenuItem value={1}>
                  ******** 12
                </MenuItem>
                <MenuItem value={2}>
                  ******** 12
                </MenuItem>
              </MenuSelect>
            </div>

            <AmountField
              amount={amount}
              onChange={setAmountField}
              maxAmount={maxAmount}
              displayConverter
              label={t('Amount')}
              placeHolder={t('Insert transaction amount')}
              name="amount"
            />

            <div className={`${styles.fieldGroup} ${styles.recipientFieldWrapper}`}>
              <span className={`${styles.fieldLabel}`}>{t('Recipient Address')}</span>
              <BookmarkAutoSuggest
                bookmarks={bookmarks[token].filter((item) => !item.disabled)}
                recipient={recipient}
                t={t}
                updateField={setRecipientField}
              />
            </div>
            <MessageField
              name="reference"
              value={reference.value}
              onChange={setReference}
              label={t('Message (Optional)')}
              placeholder={t('Write message')}
            />
          </BoxContent>
        </>
      </TxComposer>
    </section>
  );
};

export default SendForm;

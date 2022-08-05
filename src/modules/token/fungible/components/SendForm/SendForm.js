import React, { useState } from 'react';
import Piwik from 'src/utils/piwik';
import { MODULE_ASSETS_NAME_ID_MAP } from '@transaction/configuration/moduleAssets';
import AmountField from 'src/modules/common/components/amountField';
import TokenAmount from '@token/fungible/components/tokenAmount';
import { mockAppTokens } from '@tests/fixtures/token';
import Icon from 'src/theme/Icon';
import { toRawLsk, fromRawLsk } from '@token/fungible/utils/lsk';
import BoxContent from 'src/theme/box/content';
import BoxHeader from 'src/theme/box/header';
import { useCurrentApplication } from 'src/modules/blockchainApplication/manage/hooks/useCurrentApplication';
import useApplicationManagement from 'src/modules/blockchainApplication/manage/hooks/useApplicationManagement';
import MenuSelect, { MenuItem } from 'src/modules/wallet/components/MenuSelect';
import TxComposer from '@transaction/components/TxComposer';
import blockchainApplicationsExplore from '@tests/fixtures/blockchainApplicationsExplore';
import BookmarkAutoSuggest from './bookmarkAutoSuggest';
import useAmountField from '../../hooks/useAmountField';
import useMessageField from '../../hooks/useMessageField';
import useRecipientField from '../../hooks/useRecipientField';
import styles from './form.css';
import MessageField from '../MessageField';
import chainLogo from '../../../../../../setup/react/assets/images/LISK.png';

const defaultToken = mockAppTokens[0];
const getInitialData = (rawTx, initialValue) => rawTx?.asset.data || initialValue || '';
const getInitialAmount = (rawTx, initialValue) => (Number(rawTx?.asset.amount) ? fromRawLsk(rawTx?.asset.amount) : initialValue || '');
const getInitialRecipient = (rawTx, initialValue) => rawTx?.asset.recipient.address || initialValue || '';

// eslint-disable-next-line max-statements
const SendForm = (props) => {
  const {
    t,
    account = {},
    bookmarks,
    nextStep,
  } = props;

  const [currentApplication] = useCurrentApplication();
  const { applications } = useApplicationManagement();
  const [selectedToken, setSelectedToken] = useState(defaultToken.tokenID);
  const [recipientChainId, setRecipientChainId] = useState(currentApplication.chainID);
  const [sendingChainId, setSendingChainId] = useState(currentApplication.chainID);

  const [reference, setReference] = useMessageField(
    getInitialData(props.prevState?.rawTx, props.initialValue?.reference),
  );
  const [amount, setAmountField] = useAmountField(
    getInitialAmount(
      props.prevState?.rawTx,
      props.initialValue?.amount,
    ),
    account.summary?.balance,
    selectedToken.symbol,
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
    recipientChainId,
    sendingChainId,
    moduleAssetId: MODULE_ASSETS_NAME_ID_MAP.transfer,
    asset: {
      amount: toRawLsk(amount.value),
      data: reference.value,
      token: selectedToken,
      recipient: {
        address: recipient.value,
        title: recipient.title,
      },
    },
  };

  return (
    <section className={styles.wrapper}>
      <TxComposer
        onComposed={onComposed}
        onConfirm={onConfirm}
        transaction={transaction}
        buttonTitle={t('Go to confirmation')}
      >
        <>
          <BoxHeader className={styles.header}>
            <h2>{t('Send Tokens')}</h2>
          </BoxHeader>
          <BoxContent className={styles.formSection}>
            <div className={`${styles.ApplilcationFieldWrapper}`}>
              <div>
                <label className={`${styles.fieldLabel} recipient-application`}>
                  <span>{t('From Application')}</span>
                </label>
                <MenuSelect value={sendingChainId} onChange={(value) => setSendingChainId(value)}>
                  {applications.map(({ name, chainID }) => (
                    <MenuItem className={styles.chainOptionWrapper} value={chainID} key={chainID}>
                      <img className={styles.chainLogo} src={chainLogo} />
                      <span>{name}</span>
                    </MenuItem>
                  ))}
                </MenuSelect>
              </div>
              <div>
                <Icon name="transferArrow" />
              </div>
              <div>
                <label className={`${styles.fieldLabel} recipient-application`}>
                  <span>{t('To Application')}</span>
                </label>
                <MenuSelect
                  value={recipientChainId}
                  onChange={(value) => setRecipientChainId(value)}
                >
                  {blockchainApplicationsExplore.map(({ name, chainID }) => (
                    <MenuItem className={styles.chainOptionWrapper} value={chainID} key={chainID}>
                      <img className={styles.chainLogo} src={chainLogo} />
                      <span>{name}</span>
                    </MenuItem>
                  ))}
                </MenuSelect>
              </div>
            </div>
            <div className={`${styles.fieldGroup} token`}>
              <label className={`${styles.fieldLabel}`}>
                <span>{t('Token')}</span>
              </label>
              <span className={styles.balance}>
                Balance:&nbsp;
                <span>
                  <TokenAmount val={amount} />
                  {' '}
                  {selectedToken.symbol}
                </span>
              </span>
              <MenuSelect value={selectedToken} onChange={(value) => setSelectedToken(value)}>
                {mockAppTokens.map((token) => (
                  <MenuItem className={styles.chainOptionWrapper} value={token} key={token.name}>
                    <img className={styles.chainLogo} src={chainLogo} />
                    <span>{token.name}</span>
                  </MenuItem>
                ))}
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
                bookmarks={bookmarks.LSK.filter((item) => !item.disabled)}
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

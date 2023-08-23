/* eslint-disable max-statements, complexity, max-lines */
import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import grid from 'flexboxgrid/dist/flexboxgrid.css';

import { extractAddressFromPublicKey, truncateAddress } from '@wallet/utils/account';
import WalletVisual from '@wallet/components/walletVisual';
import CopyToClipboard from '@common/components/copyToClipboard';
import Box from '@theme/box';
import { useCurrentAccount, useAccounts } from '@account/hooks';
import BoxContent from '@theme/box/content';
import BoxInfoText from '@theme/box/infoText';
import Dialog from '@theme/dialog/dialog';
import Icon from '@theme/Icon';
import { Input } from 'src/theme';
import { TertiaryButton } from '@theme/buttons';
import { updateCurrentAccount, updateAccount } from '@account/store/action';
import { updateHWAccount } from '@hardwareWallet/store/actions';
import { regex } from 'src/const/regex';
import routes from 'src/routes/routes';
import defaultBackgroundImage from '@setup/react/assets/images/default-chain-background.png';
import { useAuth } from '@auth/hooks/queries';
import { useValidators } from '@pos/validator/hooks/queries';
import { downloadJSON } from '@transaction/utils';

import Members from '../multisignatureMembers';
import styles from './AccountDetails.css';

const emptyKeys = {
  numberOfSignatures: 0,
  optionalKeys: [],
  mandatoryKeys: [],
};

const editAccountFormSchema = yup
  .object({
    accountName: yup
      .string()
      .required()
      .matches(
        regex.accountName,
        'Can be alphanumeric with either !,@,$,&,_,. as special characters'
      )
      .max(20, "Character length can't be more than 20")
      .min(3, "Character length can't be less than 3"),
  })
  .required();

const AccountDetails = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [currentAccount] = useCurrentAccount();
  const { accounts } = useAccounts();
  const address = currentAccount.metadata?.address;
  const { data: authData, isLoading: authLoading } = useAuth({
    config: { params: { address } },
  });
  const accountName = currentAccount.metadata?.name;
  const appendAccountName = `-${accountName}`;
  const fileName = `${address}${accountName ? appendAccountName : ''}-lisk-account`;
  const truncatedFilename = `${truncateAddress(fileName)}.json`;
  const {
    numberOfSignatures,
    optionalKeys,
    mandatoryKeys,
    nonce = 0,
  } = authData?.data || emptyKeys;
  const { name = '', publicKey = '' } = authData?.meta ?? {};
  const { data: validatorData } = useValidators({
    config: { params: { address } },
    options: { enabled: !!name },
  });

  const members = useMemo(
    () =>
      optionalKeys
        .map((memberPublicKey) => ({
          address: extractAddressFromPublicKey(memberPublicKey),
          publicKey: memberPublicKey,
          mandatory: false,
        }))
        .concat(
          mandatoryKeys.map((memberPublicKey) => ({
            address: extractAddressFromPublicKey(memberPublicKey),
            publicKey: memberPublicKey,
            mandatory: true,
          }))
        ),
    [numberOfSignatures, optionalKeys, mandatoryKeys]
  );
  const [readMode, setReadMode] = useState(true);
  const [editedAccountName, setEditedAccountName] = useState(name);

  useEffect(() => {
    setEditedAccountName(name);
  }, [authData?.data]);

  const {
    register,
    watch,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
    setValue,
    setError,
  } = useForm({
    resolver: yupResolver(editAccountFormSchema),
  });
  const formValues = watch();
  const accountNameError = errors.accountName?.message;

  const downloadAccountJSON = () => {
    downloadJSON(currentAccount, fileName);
  };

  const updateAccountName = () => {
    setEditedAccountName(editedAccountName);
    setReadMode(true);
  };

  const setMode = (e) => {
    e.preventDefault();
    setValue('accountName', accountName || editedAccountName);
    setReadMode(!readMode);
  };

  const onFormSubmit = (values) => {
    const modifiedAccountName = values.accountName;
    setEditedAccountName(modifiedAccountName);
    const existingAccountName = accounts.some(
      (acc) =>
        acc.metadata.name.toLowerCase() === modifiedAccountName.toLowerCase() &&
        acc.metadata.address !== currentAccount.metadata.address
    );
    if (existingAccountName) {
      setError('accountName', {
        message: t(`Account with name "${modifiedAccountName}" already exists.`),
      });
      return;
    }
    dispatch(updateCurrentAccount({ name: modifiedAccountName }));
    if (currentAccount.metadata.isHW) {
      const updatedAccount = {
        ...currentAccount,
        metadata: { ...currentAccount.metadata, name: modifiedAccountName },
      };
      dispatch(updateHWAccount(updatedAccount));
    } else {
      dispatch(
        updateAccount({
          encryptedAccount: currentAccount,
          accountDetail: { name: modifiedAccountName },
        })
      );
    }
    setReadMode(!readMode);
    reset();
  };

  return (
    <Dialog hasClose className={`${grid.row} ${grid['center-xs']} ${styles.container}`}>
      <header className={styles.header}>
        <img src={defaultBackgroundImage} className={styles.bg} />
        <h3>{t('Account details')}</h3>
        <WalletVisual address={address} size={64} className={styles.avatar} />
      </header>
      <Box isLoading={false} className={styles.wrapper}>
        <BoxContent className={styles.mainContent}>
          <BoxInfoText className={styles.infoHeader}>
            <div className={styles.accountName}>
              {readMode ? (
                <>
                  <h3>{currentAccount.metadata?.name}</h3>
                  {numberOfSignatures > 0 && <Icon name="multisigKeys" />}
                  {!authLoading && <Icon name="edit" onClick={(e) => setMode(e)} />}
                </>
              ) : (
                <>
                  <form onSubmit={handleSubmit(onFormSubmit)}>
                    <Input
                      autoComplete="off"
                      className={`account-edit-input ${styles.editInput}`}
                      placeholder={t('Update name')}
                      size="m"
                      value={formValues.accountName}
                      error={!!accountNameError}
                      feedback={accountNameError}
                      status={accountNameError ? 'error' : 'ok'}
                      {...register('accountName')}
                    />
                    <TertiaryButton
                      onClick={updateAccountName}
                      className={`account-cancel-button ${styles.cancelBtn}`}
                      size="m"
                    >
                      {t('Cancel')}
                    </TertiaryButton>
                    <TertiaryButton
                      className={`account-save-changes-button ${styles.confirmBtn}`}
                      size="m"
                      disabled={!!accountNameError || !isDirty}
                      type="submit"
                    >
                      {t('Save changes')}
                    </TertiaryButton>
                  </form>
                </>
              )}
            </div>
            <div className={styles.infoRow}>
              <span className={styles.title}>{t('Backup account')}: </span>
              <Icon name="filePlain" />
              {truncatedFilename}
              <Icon
                name="downloadBlue"
                className={styles.downloadIcon}
                onClick={downloadAccountJSON}
              />
            </div>
          </BoxInfoText>
          <div className={styles.infoContainer}>
            <div>
              <div className={styles.row}>
                <span className={styles.title}>{t('Address')}:</span>
                <CopyToClipboard
                  value={address}
                  className={styles.rowValue}
                  text={truncateAddress(address)}
                />
              </div>
              <div className={styles.row}>
                <span className={styles.title}>{t('Public Key')}:</span>
                <CopyToClipboard
                  value={publicKey}
                  className={styles.rowValue}
                  text={truncateAddress(publicKey)}
                />
              </div>
            </div>
            <div>
              <div className={styles.row}>
                <span className={styles.title}>{t('Nonce')}: </span>
                <span>{nonce}</span>
              </div>
            </div>
          </div>
          {name && (
            <div className={styles.infoContainer}>
              <div>
                <div className={`${styles.header} ${styles.sectionHeader}`}>
                  <span>{t('Validator details')}</span>
                </div>
                <div className={styles.row}>
                  <div className={styles.detailsWrapper}>
                    <span className={styles.title}>{t('Name')}: </span>
                    <span>{name}</span>
                  </div>
                </div>
              </div>
              <div>
                <div className={`${styles.link} ${styles.sectionHeader}`}>
                  <Link to={`${routes.validatorProfile.path}?address=${address}`}>
                    {t('View profile')}
                  </Link>
                </div>
                <div className={styles.row}>
                  <div className={styles.detailsWrapper}>
                    <span className={styles.title}>{t('Rank')}: </span>
                    <span>#{validatorData?.data[0].rank}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          {numberOfSignatures > 0 && (
            <div className={styles.infoContainer}>
              <div className={styles.multisigDetailsWrapper}>
                <div className={`${styles.header} ${styles.sectionHeader}`}>
                  <span>{t('Multisignature details')}</span>
                </div>
                <Members
                  members={members}
                  numberOfSignatures={numberOfSignatures}
                  showSignatureCount
                  t={t}
                  size={40}
                  className={styles.members}
                />
              </div>
            </div>
          )}
        </BoxContent>
      </Box>
    </Dialog>
  );
};

export default AccountDetails;

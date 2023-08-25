import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import routes from 'src/routes/routes';
import { PrimaryButton, TertiaryButton } from '@theme/buttons';
import useSettings from '@settings/hooks/useSettings';
import { extractKeyPair, extractAddressFromPublicKey } from '@wallet/utils/account';
import { defaultDerivationPath } from '@account/const';
import WalletVisual from '@wallet/components/walletVisual';
import registerStyles from '../Signup/register.css';
import styles from './chooseAvatar.css';

// eslint-disable-next-line max-statements
const ChooseAvatar = ({ accounts, selected, handleSelectAvatar, nextStep }) => {
  const [deselect, setDeselect] = useState({});
  const [accountList, setAccountList] = useState([]);
  const prevDeselect = useRef({});
  const wrapperRef = useRef();
  const timeout = useRef();
  const { t } = useTranslation();
  const { enableAccessToLegacyAccounts } = useSettings('enableAccessToLegacyAccounts');

  const getAvatarAnimationClassName = ({ address, selected: selectedAddress, previous }) =>
    selectedAddress === address ? styles.selected : (previous === address && styles.deselect) || '';

  useEffect(() => {
    if (accounts.length) {
      const getAcctList = async () => {
        await Promise.all(
          accounts.map(async (account) => {
            const options = {
              passphrase: account.passphrase,
              enableAccessToLegacyAccounts,
              derivationPath: defaultDerivationPath,
            };
            const { publicKey } = await extractKeyPair(options);
            const address = extractAddressFromPublicKey(publicKey);
            return { ...account, address };
          })
        ).then((list) => {
          setAccountList(list);
        });
      };

      getAcctList();
    }
  }, [accounts]);

  useEffect(() => {
    prevDeselect.current = selected;
    setDeselect(prevDeselect.current);
  }, [selected]);

  const handleNextStep = () => {
    if (selected.address) {
      nextStep({ accounts });
    } else {
      const animateClass = `${styles.animate}`;
      clearTimeout(timeout.current);
      wrapperRef.current.classList.add(animateClass);
      timeout.current = setTimeout(() => wrapperRef.current.classList.remove(animateClass), 1250);
    }
  };

  return (
    <>
      <div className={registerStyles.titleHolder}>
        <h1 className={styles.title}>{t('Choose your avatar')}</h1>
        <p>{t('This avatar will be linked to your new Lisk address.')}</p>
      </div>
      <div
        ref={wrapperRef}
        className={`${styles.avatarsHolder} ${
          selected.address ? styles.avatarSelected : ''
        } choose-avatar`}
        data-testid="avatars-holder"
      >
        {accountList.map((account, key) => (
          <span
            className={getAvatarAnimationClassName({
              address: account.address,
              selected: selected.address,
              previous: deselect.address,
            })}
            data-testid={`choose-avatar-${account.address}`}
            onClick={() => handleSelectAvatar(account)}
            key={key}
          >
            <WalletVisual address={account.address} size={64} />
          </span>
        ))}
      </div>
      <div className={`${registerStyles.buttonsHolder} ${styles.buttons}`}>
        <Link
          className={`${registerStyles.button} ${registerStyles.backButton}`}
          to={routes.addAccountOptions.path}
        >
          <TertiaryButton>{t('Go back')}</TertiaryButton>
        </Link>
        <span className={`${registerStyles.button}`}>
          <PrimaryButton
            className={`${registerStyles.continueBtn} get-passphrase-button`}
            onClick={handleNextStep}
          >
            {t('Continue')}
          </PrimaryButton>
        </span>
      </div>
    </>
  );
};

export default ChooseAvatar;

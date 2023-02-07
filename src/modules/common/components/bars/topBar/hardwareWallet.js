import React, { useState } from 'react';
import Dropdown from 'src/theme/Dropdown/dropdown';
import { useTranslation } from 'react-i18next';
import Icon from 'src/theme/Icon';
import { TertiaryButton } from 'src/theme/buttons';
import styles from './hardwareWallet.css';

const HardwareWallet = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const { t } = useTranslation();

  const status = 'standby';

  const closeDropdown = () => {
    setShowDropdown(false);
  };
  const toggleShowDropdown = () => setShowDropdown((dropDownShowState) => !dropDownShowState);

  const hwStatusInfo = [
    { label: 'Brand :', value: 'Ledger' },
    { label: 'Model :', value: 'Nano S' },
    { label: 'ID :', value: '23233' },
    { label: 'Status :', value: 'Connected', isStatus: true },
  ];

  return (
    <section className={styles.wrapper}>
      <TertiaryButton className={styles[status]} onClick={toggleShowDropdown}>
        <Icon name="hardwareWalletIcon" />
      </TertiaryButton>
      <Dropdown
        showDropdown={showDropdown}
        className={styles.dropdown}
        closeDropdown={closeDropdown}
      >
        <h6>
          <b>{t('Hardware wallet details')}</b>
        </h6>
        <ul>
          {hwStatusInfo.map(({ label, value }) => (
            <li key={label}>
              <div>{label}</div>
              <div>{value}</div>
            </li>
          ))}
        </ul>
      </Dropdown>
    </section>
  );
};

export default HardwareWallet;

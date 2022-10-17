import React from 'react';
import { useTranslation } from 'react-i18next';
import TokenAmount from '@token/fungible/components/tokenAmount';
import MenuSelect, { MenuItem } from 'src/modules/wallet/components/MenuSelect';
import chainLogo from '@setup/react/assets/images/LISK.png';
import TokenStyle from './TokenField.css';

export const TokenField = ({ styles, onChange, value, tokens }) => {
  const { t } = useTranslation();
  return (
    <div className={`${styles.fieldGroup} token`}>
      <label className={`${styles.fieldLabel}`}>
        <span>{t('Token')}</span>
      </label>
      {value?.availableBalance && (
        <span className={styles.balance}>
          {t('Balance')}:&nbsp;
          <span>
            <TokenAmount val={value?.availableBalance} token={value?.symbol} />
          </span>
        </span>
      )}
      <MenuSelect
        value={value}
        onChange={onChange}
        select={(selectedValue, option) => selectedValue?.name === option.name}
      >
        {tokens?.map((tokenValue) => (
          <MenuItem
            className={TokenStyle.chainOptionWrapper}
            value={tokenValue}
            key={tokenValue.name}
          >
            <img className={TokenStyle.chainLogo} src={tokenValue.logo || chainLogo} />
            <span>{tokenValue.name}</span>
          </MenuItem>
        ))}
      </MenuSelect>
    </div>
  );
};

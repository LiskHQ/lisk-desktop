import React from 'react';
import MenuSelect, {
  MenuItem
} from 'src/modules/wallet/components/MenuSelect';
import chainLogo from '@setup/react/assets/images/LISK.png';

// eslint-disable-next-line import/prefer-default-export
export const ApplicationField = ({ styles, onChange, value,
  applications,
  label,
}) => (
    <div>
      <label className={`${styles.fieldLabel} recipient-application`}>
        <span>{label}</span>
      </label>
      <MenuSelect
        value={value}
        onChange={onChange}
        select={(selectedValue, option) => selectedValue?.chainID === option.chainID}
      >
        {applications.map((chain) => (
          <MenuItem className={styles.chainOptionWrapper} value={chain} key={chain?.chainID}>
            <img className={styles.chainLogo} src={chain?.logo?.png || chainLogo} />
            <span>{chain?.chainName}</span>
          </MenuItem>
        ))}
      </MenuSelect>
    </div>
  );

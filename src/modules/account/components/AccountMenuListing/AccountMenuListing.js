import React from 'react';
import { useTranslation } from 'react-i18next';

import Icon from 'src/theme/Icon';
import { useCurrentAccount } from '@account/hooks';
import DialogLink from '@theme/dialog/link';
import { Link } from 'react-router-dom';
import { ACCOUNT_MENU } from '@account/const';

const AccountMenuListing = ({ className }) => {
  const { t } = useTranslation();
  const [currentAccount] = useCurrentAccount();

  function getDialogProps(component) {
    if (component === 'removeSelectedAccount' && currentAccount?.metadata?.address) {
      return {
        component,
        data: { address: currentAccount?.metadata?.address },
      };
    }
    return { component };
  }

  return (
    <ul className={className}>
      {ACCOUNT_MENU.map(({ path, icon, label, component }) => (
        <li key={label}>
          {component ? (
            <DialogLink {...getDialogProps(component)}>
              <Icon name={icon} />
              {t(label)}
            </DialogLink>
          ) : (
            <Link to={path}>
              <Icon name={icon} />
              {t(label)}
            </Link>
          )}
        </li>
      ))}
    </ul>
  );
};

export default AccountMenuListing;

import React from 'react';
import { useTranslation } from 'react-i18next';

import Icon from 'src/theme/Icon';
import { useCurrentAccount } from '@account/hooks';
import DialogLink from '@theme/dialog/link';
import { Link } from 'react-router-dom';
import { accountMenu } from '@account/const';
import { useAuth } from '@auth/hooks/queries';

const AccountMenuListing = ({ className, onItemClicked }) => {
  const { t } = useTranslation();
  const [currentAccount] = useCurrentAccount();
  const { data: authData } = useAuth({
    config: { params: { address: currentAccount?.metadata?.address } },
  });

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
      {accountMenu(authData).map(
        ({ path, icon, label, component, isHidden }) =>
          !isHidden && (
            <li key={label} onClick={onItemClicked}>
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
          )
      )}
    </ul>
  );
};

export default AccountMenuListing;

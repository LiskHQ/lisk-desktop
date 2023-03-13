/* eslint-disable max-statements */
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { withRouter } from 'react-router';
import MenuSelect, { MenuItem } from '@wallet/components/MenuSelect';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { PrimaryButton } from 'src/theme/buttons';
import Icon from 'src/theme/Icon';
import { DEFAULT_NETWORK } from 'src/const/config';
import routes from 'src/routes/routes';
import styles from './SelectNetwork.css';
import networks from '../../configuration/networks';

function ManageAccounts({ history }) {
  const { t } = useTranslation();
  const [selectedNetwork, setSelectedNetwork] = useState(networks[DEFAULT_NETWORK]);

  const onAddAccount = useCallback(() => {
    history.push(routes.addAccountOptions.path);
  }, []);

  return (
    <div className={`${styles.selectNetworkWrapper} ${grid.row}`}>
      <div
        className={`${styles.selectNetwork} ${grid['col-xs-12']} ${grid['col-md-8']} ${grid['col-lg-6']}`}
      >
        <div className={styles.wrapper}>
          <div className={styles.headerWrapper}>
            <h1 data-testid="manage-title">{t('Switch Network')}</h1>
          </div>
          <div className={styles.contentWrapper}>
            <p className={styles.subHeader}>
              {t(
                '"Lisk" will be the default mainchain application, please select your preferred network for accessing the wallet. Once selected please click on "Continue to dashboard".'
              )}
            </p>
            <div>
              <Icon name="liskLogoWhiteNormalized" />
            </div>
            <h6>Lisk</h6>
          </div>
          <div className={styles.networkSelectionWrapper}>
            <label>Select network</label>
            <MenuSelect
              value={selectedNetwork}
              select={(selectedValue, option) => selectedValue.label === option.label}
              onChange={setSelectedNetwork}
              popupClassName={styles.networksPopup}
              className={styles.menuSelect}
            >
              {Object.values(networks).map((network) => (
                <MenuItem
                  className={`${styles.networkItem} ${
                    selectedNetwork.label === network.label ? styles.selected : ''
                  }`}
                  value={network}
                  key={network.label}
                >
                  <span>{network.label}</span>
                </MenuItem>
              ))}
            </MenuSelect>
          </div>
          <PrimaryButton
            className={`${styles.button} ${styles.continueBtn}`}
            onClick={onAddAccount}
          >
            {t('Continue to dashbord')}
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}

ManageAccounts.defaultProps = {
  isRemoveAvailable: true,
  isDialog: false,
};

export default withRouter(ManageAccounts);

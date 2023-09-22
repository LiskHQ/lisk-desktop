import React from 'react';
import { MenuItem } from '@wallet/components/MenuSelect';
import Icon from '@theme/Icon';
import { removeThenAppendSearchParamsToUrl } from 'src/utils/searchParams';
import { useHistory } from 'react-router-dom';
import classNames from 'classnames';
import styles from './NetworkMenuItem.css';

function NetworkMenuItem({ className, value, currentNetworkName, isSelected }) {
  const history = useHistory();

  const editCustomNetwork = (e, data) => {
    e.stopPropagation();
    removeThenAppendSearchParamsToUrl(history, { modal: 'dialogAddNetwork', ...data }, ['modal']);
  };
  const deleteCustomNetwork = (e, data) => {
    e.stopPropagation();
    removeThenAppendSearchParamsToUrl(history, { modal: 'dialogRemoveNetwork', ...data }, [
      'modal',
    ]);
  };

  return (
    <MenuItem
      className={classNames(styles.NetworkMenuItem, className, {
        [styles.selected]: isSelected,
      })}
      value={value}
      key={value.label}
    >
      <span>
        <span>{value.label}</span>
      </span>
      <span className={styles.networkIcons}>
        {value.isCustom && (
          <>
            <span
              onClick={(e) =>
                editCustomNetwork(e, {
                  name: value.name,
                  serviceUrl: value.serviceUrl,
                })
              }
            >
              <Icon name="edit" className={styles.modifyIcons} />
            </span>
            {currentNetworkName !== value.name && (
              <span
                onClick={(e) =>
                  deleteCustomNetwork(e, {
                    name: value.name,
                    serviceUrl: value.serviceUrl,
                  })
                }
              >
                <Icon name="deleteIcon" className={styles.modifyIcons} />
              </span>
            )}
          </>
        )}
        {isSelected && <Icon name="okIcon" />}
      </span>
    </MenuItem>
  );
}

export default NetworkMenuItem;

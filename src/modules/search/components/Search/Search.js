import React from 'react';

import { regex } from 'src/const/regex';
import routes from '@screens/router/routes';
import Icon from 'src/theme/Icon';
import DialogLink from 'src/theme/dialog/link';
import WalletVisual from '@wallet/components/walletVisual';
import Tooltip from 'src/theme/Tooltip';
import styles from './Search.css';
import { getSearchedText } from '../../utils';

const Search = ({ t, history, disabled }) => {
  const { relevantSearchParam, relevantSearchParamValue } = getSearchedText(history);

  return (
    <Tooltip
      className={styles.tooltipWrapper}
      size="maxContent"
      position="bottom"
      content={(
        <DialogLink
          component="search"
          className={`${styles.toggle} search-toggle ${
            disabled && `${styles.disabled} disabled`
          }`}
        >
          <span
            className={
              relevantSearchParam
                ? `${styles.searchContainer} ${styles.searchContainerParam}`
                : styles.searchContainer
            }
          >
            <Icon
              name={relevantSearchParam ? 'search' : 'searchInput'}
              className="search-icon"
            />
            {relevantSearchParam === routes.explorer.searchParam
              && relevantSearchParamValue && (
                <WalletVisual
                  className={styles.walletVisual}
                  size={18}
                  address={relevantSearchParamValue}
                />
            )}
            {relevantSearchParamValue && (
              <>
                <div className="hideOnLargeViewPort">
                  <span className={styles.searchedValue}>
                    {relevantSearchParamValue.replace(regex.searchbar, '$1...')}
                  </span>
                </div>
                <div className="showOnLargeViewPort">
                  <span className={styles.searchedValue}>
                    {relevantSearchParamValue}
                  </span>
                </div>
              </>
            )}
          </span>
        </DialogLink>
      )}
    >
      <p>{t('Search')}</p>
    </Tooltip>
  );
};

export default Search;

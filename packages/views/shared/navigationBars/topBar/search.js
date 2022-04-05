import React from 'react';

import { regex } from '@common/configuration';
import { selectSearchParamValue } from '@screens/router/searchParams';
import routes from '@screens/router/routes';
import Icon from '@basics/icon';
import DialogLink from '@basics/dialog/link';
import AccountVisual from '@wallet/detail/info/accountVisual';
import Tooltip from '@basics/tooltip/tooltip';
import styles from './topBar.css';

/**
 * Extracts only one search param out of the url that is relevant
 * to the screen shown
 * @param {string} path the url path
 */
const extractRelevantSearchParam = (path) => {
  const relevantRoute = Object.values(routes).find(route => route.path === path);
  if (relevantRoute) {
    return relevantRoute.searchParam;
  }
  return undefined;
};

/**
 * Gets the searched value depending upon the screen the user is on
 * and the url search
 * @param {object} history the history object
 */
const getSearchedText = (history) => {
  const screenName = history.location.pathname;
  const relevantSearchParam = extractRelevantSearchParam(screenName);
  const relevantSearchParamValue = selectSearchParamValue(
    history.location.search, relevantSearchParam,
  );
  return { relevantSearchParam, relevantSearchParamValue };
};

const Search = ({
  t,
  history,
  disabled,
}) => {
  const { relevantSearchParam, relevantSearchParamValue } = getSearchedText(history);

  return (
    <Tooltip
      className={styles.tooltipWrapper}
      size="maxContent"
      position="bottom"
      content={(
        <DialogLink component="search" className={`${styles.toggle} search-toggle ${disabled && `${styles.disabled} disabled`}`}>
          <span className={relevantSearchParam ? `${styles.searchContainer} ${styles.searchContainerParam}` : styles.searchContainer}>
            <Icon name={relevantSearchParam ? 'search' : 'searchInput'} className="search-icon" />
            {
              relevantSearchParam === routes.account.searchParam && relevantSearchParamValue
                && (
                  <AccountVisual
                    className={styles.accountVisual}
                    size={18}
                    address={relevantSearchParamValue}
                  />
                )
            }
            {relevantSearchParamValue
              && (
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

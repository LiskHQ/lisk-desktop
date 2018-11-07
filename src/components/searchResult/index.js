import React from 'react';
import { translate } from 'react-i18next';
import Box from '../box';
import EmptyState from '../emptyState';
import styles from './search.css';

const SearchResult = ({ t }) => (
  <Box className={styles.resultWrapper}>
    <EmptyState title={t('No results')}
      message={t('Search for Lisk ID or Transaction ID')} />
  </Box>
);

export default translate()(SearchResult);


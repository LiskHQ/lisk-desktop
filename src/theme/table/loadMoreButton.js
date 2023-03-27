import React from 'react';
import { withTranslation } from 'react-i18next';
import FooterButton from '../box/footerButton';
import styles from './table.css';

const LoadMoreButton = ({ t, onClick, error, dataLength, canLoadMore, isFetching }) => {
  if (error || dataLength === 0 || !canLoadMore || isFetching) return null;
  return (
    <FooterButton
      className={`${styles.loadMore} load-more`}
      onClick={onClick}
      disabled={isFetching}
    >
      {t('Load more')}
    </FooterButton>
  );
};

export default withTranslation()(LoadMoreButton);

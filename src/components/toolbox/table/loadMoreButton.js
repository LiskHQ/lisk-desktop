import React from 'react';
import { withTranslation } from 'react-i18next';
import FooterButton from '../box/footerButton';
import styles from './table.css';

const LoadMoreButton = ({
  t, onClick, error, dataLength, canLoadMore, isLoading,
}) => {
  if (
    error
    || dataLength === 0
    || !canLoadMore
  ) return null;
  return (
    <FooterButton
      className={`${styles.loadMore} load-more`}
      onClick={onClick}
      disabled={isLoading}
    >
      {t('Load more')}
    </FooterButton>
  );
};

export default withTranslation()(LoadMoreButton);

import React from 'react';
import { withTranslation } from 'react-i18next';
import FooterButton from '../box/footerButton';

const LoadMoreButton = ({
  t, onClick, error, dataLength, canLoadMore,
}) => {
  if (
    error
    || dataLength === 0
    || dataLength % 30 !== 0
    || !canLoadMore
  ) return null;
  return (<FooterButton className="load-more" onClick={onClick}>{t('Load more')}</FooterButton>);
};

export default withTranslation()(LoadMoreButton);

import React from 'react';
import { translate } from 'react-i18next';
import Box from '../box';
import styles from './notFound.css';
import cubeImage from '../../assets/images/dark-blue-cube.svg';

const NotFound = ({ t }) => (<section>
  <Box>
    <div className={styles.emptyTransactions}>
      <img src={cubeImage} />
      <h2 className='empty-message'>{t('Page not found.')}</h2>
      <p>{t('Try using menu for navigation.')}</p>
    </div>
  </Box>
</section>);

export default translate()(NotFound);

import { Link } from 'react-router-dom';
import React from 'react';
import { translate } from 'react-i18next';
import styles from './notFound.css';
import { PrimaryButtonV2 } from '../toolbox/buttons/button';
import Illustration from '../toolbox/illustration';
import routes from '../../constants/routes';

const NotFound = ({ t }) => (
  <section className={styles.notFoundPage}>
    <div className={styles.errorMessageContainer}>
      <Illustration name={ 'pageNotFound' }/>
      <h2 className='empty-message'>{t('Whoops, that page is gone.')}</h2>
      <p>{t('Sorry, we couldn’t find the page you were looking for. We suggest that you return to the main dashboard.')}</p>
      <Link className={'go-to-dashboard-button'} to={routes.dashboard.path}>
        <PrimaryButtonV2 className={styles.goToDashboardButton}>
          {t('Go to Dashboard')}
        </PrimaryButtonV2>
      </Link>

    </div>
</section>);

export default translate()(NotFound);

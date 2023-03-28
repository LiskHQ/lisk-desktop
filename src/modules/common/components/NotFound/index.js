import { Link } from 'react-router-dom';
import React from 'react';
import { withTranslation } from 'react-i18next';
import routes from 'src/routes/routes';
import { PrimaryButton } from 'src/theme/buttons';
import Illustration from 'src/modules/common/components/illustration';
import styles from './notFound.css';

const NotFound = ({ t }) => (
  <section className={styles.notFoundPage}>
    <div className={styles.errorMessageContainer}>
      <Illustration name="pageNotFound" />
      <h2 className="empty-message">{t('Whoops, that page is gone.')}</h2>
      <p>
        {t(
          'Sorry, we couldn’t find the page you were looking for. We suggest that you return to the main dashboard.'
        )}
      </p>
      <Link className="go-to-dashboard-button" to={routes.wallet.path}>
        <PrimaryButton className={styles.goToDashboardButton}>{t('Go to dashboard')}</PrimaryButton>
      </Link>
    </div>
  </section>
);

export default withTranslation()(NotFound);

import React from 'react';
import { withTranslation } from 'react-i18next';
import Piwik from '@utils/piwik';
import { PrimaryButton, TertiaryButton } from '../../toolbox/buttons';
import styles from './errorBoundary.css';
import Illustration from '../../toolbox/illustration';

/* eslint-disable class-methods-use-this, no-unused-vars */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error, info) {
    this.setState({ hasError: true, error, info });
  }

  reloadPage() {
    Piwik.trackingEvent('ErrorBoundary', 'button', 'Reload page');
    window.location.reload();
  }

  render() {
    const { t } = this.props;
    const getMailReference = () => {
      const recipient = 'hubdev@lisk.io';
      const subject = `User Reported Error - Lisk - ${VERSION}`; // eslint-disable-line no-undef
      const body = `${this.state.error}:%0A${this.state.info.componentStack.replace(/\s{4}/g, '%0A')}`;
      return `mailto:${recipient}?&subject=${subject}&body=${body}`;
    };

    const renderErrorSection = () => (
      <section className={styles.errorBoundaryPage}>
        <div className={styles.errorMessageContainer}>
          <Illustration name="errorBoundaryPage" />
          <h2>{t('An error occurred.')}</h2>
          <p>{t('To recover, you can try to reload the page, by clicking the button below. If the problem persists, report the error via email.')}</p>
          <PrimaryButton className={`${styles.reloadPageButton} error-reload-btn`} onClick={this.reloadPage}>
            {t('Reload the page')}
          </PrimaryButton>
          <a target="_blank" href={getMailReference()} rel="noopener noreferrer">
            <TertiaryButton className={styles.reportButton}>
              {t('Report the error via E-Mail')}
            </TertiaryButton>
          </a>
        </div>
      </section>
    );

    if (this.state.hasError) {
      return renderErrorSection();
    }
    return this.props.children;
  }
}

export default withTranslation()(ErrorBoundary);

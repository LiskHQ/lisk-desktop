import React from 'react';
import { translate } from 'react-i18next';

import Box from '../box';
import { FontIcon } from '../fontIcon';
import { PrimaryButton } from './../toolbox/buttons/button';
import notFoundImg from '../../assets/images/dark-blue-cube.svg';
import styles from './errorBoundary.css';

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
    window.location.reload();
  }


  render() {
    const getMailReference = () => {
      const recipient = 'hubdev@lisk.io';
      const subject = `User Reported Error - Lisk Hub - ${VERSION}`; // eslint-disable-line no-undef
      const body = `${this.state.error}:%0A${this.state.info.componentStack.replace(/\s{4}/g, '%0A')}`;
      return `mailto:${recipient}?&subject=${subject}&body=${body}`;
    };
    const renderErrorSection = () => (
      <Box>
        <section className={styles.section}>
          <img className={styles.img} src={notFoundImg} />
          {this.props.errorMessage ?
            <h2 className={styles.header}>{this.props.t(this.props.errorMessage)}</h2> : null}
          <p className={styles.description}>{this.props.t('To recover you can')}</p>
          <PrimaryButton
            theme={styles}
            label={this.props.t('Reload this page')}
            className={`${styles.button} error-reload-btn`}
            onClick={() => this.reloadPage() }/>
          <p className={styles.description}>{this.props.t('if the problem persists')}</p>
          <a target='_blank'
            className={styles.link}
            href={getMailReference()}
            rel='noopener noreferrer'>
            {this.props.t('Report this error to the developers')}&nbsp;<FontIcon>arrow-right</FontIcon>
          </a>
        </section>
      </Box>
    );

    if (this.state.hasError) {
      return renderErrorSection();
    }
    return this.props.children;
  }
}

export default translate()(ErrorBoundary);

import React from 'react';
import { withRouter } from 'react-router';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';

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
    this.props.router.refresh();
  }


  render() {
    const renderErrorSection = () => (
      <Box>
        <section className={styles.section}>
          <img className={styles.img} src={notFoundImg} />
          {this.props.errorMessage ?
            <h2 className={styles.header}>{this.props.t(this.props.errorMessage)}</h2> : null}
          <p className={styles.description}>Try reloading this page</p>
          <PrimaryButton
            theme={styles}
            label={this.props.t('Reload this page')}
            className={`${styles.button} error-reload-btn`}
            onClick={() => this.reloadPage() }/>
          <a target='_blank'
            href={`mailto:admin@lisk.io?&subject=User%20Reported%20Error&body=${this.state.error}-${this.state.info.componentStack.replace(/ /g, '\n')}`}
            rel='noopener noreferrer'>
            {this.props.t('Report this error to the community')}&nbsp;<FontIcon>arrow-right</FontIcon>
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

const mapStateToProps = state => ({
  router: state.router,
});

export default withRouter(connect(mapStateToProps)(translate()(ErrorBoundary)));

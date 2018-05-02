import React from 'react';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';

import { FontIcon } from '../fontIcon';
import { PrimaryButton } from './../toolbox/buttons/button';
import styles from './errorBoundary.css';

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
      <section className={styles.section}>
        <p className='error-header'>{this.props.errorMessage}</p>
        <PrimaryButton
          theme={styles}
          disabled={this.state.step !== 'done'}
          label={this.props.t('Reload this page')}
          className={`${styles.button} error-reload-btn`}
          onClick={() => this.reloadPage() }/>
        <a target='_blank'
          href={`mailto:admin@lisk.io?&subject=User%20Reported%20Error&body=${this.state.info.toString()}`}
          rel='noopener noreferrer'>
          {this.props.t('Report this error to the community')}&nbsp;<FontIcon>arrow-right</FontIcon>
        </a>
      </section>
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

export default connect(mapStateToProps, (translate()(ErrorBoundary)));

import React from 'react';
import { withRouter } from 'react-router';
import { translate } from 'react-i18next';
import MultiStep from '../multiStep';
import Create from '../passphrase/create';
import Safekeeping from '../passphrase/safekeeping';
import Confirm from '../passphrase/confirm';
import Box from '../box';
import styles from './register.css';
import routes from '../../constants/routes';


class Register extends React.Component {
  // eslint-disable-next-line class-methods-use-this
  componentDidMount() {
    document.body.classList.add('contentFocused');
  }

  componentDidUpdate() {
    if (this.props.account.passphrase !== undefined) {
      this.props.history.push(`${routes.dashboard.path}`);
    }
  }

  // eslint-disable-next-line class-methods-use-this
  componentWillUnmount() {
    document.body.classList.remove('contentFocused');
  }

  onRegister(passphrase) {
    // set active peer
    this.props.liskAPIClientSet({
      passphrase,
      network: this.props.network,
    });
  }

  backToLogin() {
    this.props.history.push('/');
  }

  render() {
    const { t } = this.props;
    return (<Box className={`${styles.hasPaddingTop} ${styles.register}`}>
      <MultiStep
        prevPage={this.backToLogin.bind(this)}
        finalCallback={this.onRegister.bind(this)}
        backButtonLabel={t('Back')}>
        <Create title='Create' t={t} icon='add' />
        <Safekeeping title='Safekeeping' t={t} icon='checkmark' />
        <Confirm title='Confirm' t={t} confirmButton='Login' icon='login' />
      </MultiStep>
    </Box>);
  }
}

export default withRouter(translate()(Register));


import React from 'react';
import { withRouter } from 'react-router';
import { translate } from 'react-i18next';
import Choose from './steps/choose';
import BackgroundMaker from '../backgroundMaker';
import MultiStep from '../multiStep';
import Box from '../box';
import styles from './registerDelegate.css';

class RegisterDelegate extends React.Component {
  constructor() {
    super();

    this.state = {
      name: {
        value: '',
      },
    };
  }

  componentDidMount() {
    const newState = {
      name: {
        value: '',
      },
    };
    this.setState(newState);
  }

  register(event) {
    event.preventDefault();
    // @todo I'm not handling this part: this.setState({ nameError: error.message });
    this.props.delegateRegistered({
      activePeer: this.props.peers.data,
      account: this.props.account,
      username: this.state.name.value,
      passphrase: this.state.passphrase.value,
      secondPassphrase: this.state.secondPassphrase.value,
    });
  }

  goBack() {
    this.props.history.goBack();
  }

  render() {
    return (
      <div className={styles.wrapper}>
        <BackgroundMaker className={styles.background} />
        <Box className={styles.registerDelegate}>
          <MultiStep
            prevPage={this.goBack.bind(this)}
            finalCallback={this.register.bind(this)}
            backButtonLabel={this.props.t('Back')}>
            <Choose title='Choose' t={this.props.t} icon='add' />
            <Choose title='Confirm' t={this.props.t} icon='add' />
          </MultiStep>
        </Box>
      </div>
    );
  }
}

export default withRouter(translate()(RegisterDelegate));

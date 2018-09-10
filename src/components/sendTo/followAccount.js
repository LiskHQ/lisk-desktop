import React from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { TertiaryButton, Button } from './../toolbox/buttons/button';
import Box from '../box';
import AccountTitleInput from './../followedAccounts/accountTitleInput';
import { followedAccountAdded } from '../../actions/followedAccounts';
import styles from './followAccount.css';

class FollowAccount extends React.Component {
  constructor() {
    super();
    this.state = { title: { value: '' } };
  }

  handleChange(value, validateInput) {
    this.setState({
      title: {
        value,
        error: validateInput(value),
      },
    });
  }

  render() {
    const {
      prevStep, t, addAccount, address,
    } = this.props;

    const title = this.state.title.value || address;

    return (<Box className={`${styles.wrapper}`}>
      <header>
        <h2>{t('Follow Account')}</h2>
        <p>{t('Add this account to your dashboard to keep track of its balance.')}</p>
      </header>
      <AccountTitleInput
        title={this.state.title}
        className={styles.titleInput}
        onChange={this.handleChange.bind(this)}
      />
      <footer>
        <TertiaryButton className={`${styles.button} follow-account`}
          disabled={!!this.state.title.error}
          onClick={() => {
            addAccount({ title, address });
            // istanbul ignore else
            if (typeof this.props.finalCallback === 'function') {
              this.props.finalCallback();
              this.props.reset();
            } else {
              prevStep();
            }
          }}>
          {t('Add to dashboard')}
        </TertiaryButton>

        <Button onClick={() => prevStep()} className={`${styles.button} ${styles.follow} cancel`} >
          <span className={styles.label}>{t('Cancel')}</span>
        </Button>
      </footer>
    </Box>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  addAccount: data => dispatch(followedAccountAdded(data)),
});

export default connect(null, mapDispatchToProps)(translate()(FollowAccount));

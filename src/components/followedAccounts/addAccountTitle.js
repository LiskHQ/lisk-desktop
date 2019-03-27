import React from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { PrimaryButtonV2, SecondaryButtonV2 } from '../toolbox/buttons/button';
import { followedAccountAdded } from '../../actions/followedAccounts';
import styles from './followedAccounts.css';
import TitleInput from './accountTitleInput';
import Piwik from '../../utils/piwik';
import BoxV2 from '../boxV2';

class AddAccountTitle extends React.Component {
  constructor() {
    super();
    this.state = { title: { value: '' } };
  }

  handleChange(value, validateInput) {
    this.setState({
      title: {
        value,
        error: validateInput(value),
        isDelegate: false,
      },
    });
  }

  onCancel() {
    Piwik.trackingEvent('AddAccountTitle', 'button', 'Cancel');
    this.props.prevStep({ reset: true });
  }

  onAddToList() {
    Piwik.trackingEvent('AddAccountTitle', 'button', 'Add to list');

    const { addAccount, address, prevStep } = this.props;
    const title = this.state.title.value;
    const isDelegate = this.state.title.isDelegate;

    addAccount({ title, address, isDelegate });
    prevStep({ reset: true });
  }

  shouldComponentUpdate(nextProps) {
    const { title } = this.state;
    const { account } = nextProps;
    const username = account && account.delegate && account.delegate.username;
    if (username && username !== title.value) {
      this.setState({
        title: {
          value: username,
          error: false,
          isDelegate: true,
        },
      });
      return false;
    }
    return true;
  }

  render() {
    const { t, account } = this.props;
    const isDelegate = !!(account && account.delegate && account.delegate.username);

    return (
      <BoxV2 className={styles.addAccount}>
        <header>
          <h1>{t('How would you call it?')}</h1>
        </header>
        <div>
          <TitleInput
            title={this.state.title}
            disabled={isDelegate}
            onChange={this.handleChange.bind(this)} />
        </div>
        <footer>
          <div>
            <SecondaryButtonV2
              label={t('Cancel')}
              className={`${styles.cancelButton} cancel`}
              onClick={() => this.onCancel()}
            />
          </div>
          <div>
            <PrimaryButtonV2
              label={t('Add to list')}
              disabled={!!this.state.title.error || this.state.title.value === ''}
              className='next'
              onClick={() => this.onAddToList()}
            />
          </div>
        </footer>
      </BoxV2>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  account: state.search.accounts[ownProps.address],
  accounts: state.followedAccounts.accounts,
});

const mapDispatchToProps = dispatch => ({
  addAccount: data => dispatch(followedAccountAdded(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(translate()(AddAccountTitle));

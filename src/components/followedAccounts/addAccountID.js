import React from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { PrimaryButtonV2, SecondaryButtonV2 } from '../toolbox/buttons/button';
import regex from '../../utils/regex';
import styles from './followedAccounts.css';
import AddressInput from '../addressInput/index';
import Piwik from '../../utils/piwik';
import BoxV2 from '../boxV2';

class AddAccountID extends React.Component {
  constructor() {
    super();
    this.state = { address: { value: '' } };
  }

  handleChange(value) {
    this.setState({
      address: {
        value,
        error: this.validateInput(value),
      },
    });
  }

  validateInput(value) {
    const alreadyFollowing = this.props.accounts.filter(({ address }) =>
      address === value).length > 0;

    if (!value) {
      return this.props.t('Required');
    } else if (!value.match(regex.address)) {
      return this.props.t('Invalid address');
    } else if (alreadyFollowing) {
      return this.props.t('ID already added to bookmarks');
    }
    return undefined;
  }

  onPrevStep() {
    Piwik.trackingEvent('AddAccountID', 'button', 'Previous step');
    this.props.prevStep();
  }

  onNextStep() {
    Piwik.trackingEvent('AddAccountID', 'button', 'Next step');
    this.props.nextStep({ address: this.state.address.value });
  }

  render() {
    return (
      <BoxV2 className={styles.addAccount}>
        <header>
          <h1>{this.props.t('Add a bookmark')}</h1>
        </header>
        <div>
          <AddressInput
            label={this.props.t('Lisk ID')}
            className='address'
            address={this.state.address}
            handleChange={this.handleChange.bind(this)}
          />
        </div>
        <footer>
          <div>
            <SecondaryButtonV2
              label={this.props.t('Cancel')}
              className={`${styles.cancelButton} cancel`}
              onClick={() => this.onPrevStep()}
            />
          </div>
          <div>
            <PrimaryButtonV2
              label={this.props.t('Next')}
              className='next'
              disabled={(!!this.state.address.error || !this.state.address.value)}
              onClick={() => this.onNextStep()}
            />
          </div>
        </footer>
      </BoxV2>
    );
  }
}

const mapStateToProps = state => ({
  accounts: state.followedAccounts.accounts,
});

export default connect(mapStateToProps)(translate()(AddAccountID));

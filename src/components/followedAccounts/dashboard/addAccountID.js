import React from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { Button, TertiaryButton } from '../../toolbox/buttons/button';
import regex from './../../../utils/regex';
import styles from './followedAccounts.css';
import AddressInput from './../../addressInput';

class AddAccountID extends React.Component {
  constructor() {
    super();
    this.state = { address: { value: '' } };
  }

  showAccountVisual() {
    return this.state.address.value.length && !this.state.address.error;
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
      return this.props.t('ID already following');
    }
    return undefined;
  }


  render() {
    return <div className={styles.addAccount}>
        <header><h2>Choose an ID</h2></header>
        <div>
          <AddressInput
            label={this.props.t('Enter a Lisk ID')}
            address={this.state.address}
            handleChange={this.handleChange.bind(this)}
          />
        </div>
        <footer className={grid.row} >
          <div className={grid['col-xs-4']}>
            <Button
              label={this.props.t('Cancel')}
              className={styles.cancelButton}
              onClick={() => this.props.prevStep()}
            />
          </div>
          <div className={grid['col-xs-8']}>
            <TertiaryButton
              label={this.props.t('Next')}
              disabled={(!!this.state.address.error || !this.state.address.value)}
              onClick={() => this.props.nextStep({ address: this.state.address.value })}
            />
          </div>
        </footer>
    </div>;
  }
}

const mapStateToProps = state => ({
  accounts: state.followedAccounts.accounts,
});

export default connect(mapStateToProps)(translate()(AddAccountID));

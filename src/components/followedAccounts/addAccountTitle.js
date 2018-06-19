import React from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { Button, TertiaryButton } from '../toolbox/buttons/button';
import Input from '../toolbox/inputs/input';
import styles from './followedAccounts.css';
import { followedAccountAdded } from '../../actions/followedAccounts';

class AddAccountID extends React.Component {
  constructor() {
    super();
    this.state = { title: { value: '' } };
  }

  handleChange(value) {
    this.setState({
      title: {
        value,
        error: this.validateInput(value),
      },
    });
  }

  validateInput(value) {
    return value.length > 20 ? this.props.t('Title too long') : undefined;
  }

  render() {
    const {
      t, prevStep, addAccount, address,
    } = this.props;

    const title = this.state.title.value || address;
    return <div className={styles.addAccount}>
      <header><h2>{t('How would you call it?')}</h2></header>
      <div>
        <Input
          label={t('Title (optional)')}
          className='title'
          error={this.state.title.error}
          value={this.state.title.value}
          autoFocus={true}
          onChange={val => this.handleChange(val)}
        />
      </div>
      <footer className={grid.row} >
        <div className={grid['col-xs-4']}>
          <Button
            label={t('Cancel')}
            className={`${styles.cancelButton} cancel`}
            onClick={() => prevStep({ reset: true })}
          />
        </div>
        <div className={grid['col-xs-8']}>
          <TertiaryButton
            label={t('Add to list')}
            className='next'
            onClick={() => {
              addAccount({ title, address });
              prevStep({ reset: true });
            }}
          />
        </div>
      </footer>
    </div>;
  }
}

const mapDispatchToProps = dispatch => ({
  addAccount: data => dispatch(followedAccountAdded(data)),
});

export default connect(null, mapDispatchToProps)(translate()(AddAccountID));

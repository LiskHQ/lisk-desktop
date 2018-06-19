import React from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { Button, TertiaryButton } from '../toolbox/buttons/button';
import { followedAccountAdded } from '../../actions/followedAccounts';
import styles from './followedAccounts.css';
import TitleInput from './accountTitleInput';

class AddAccountID extends React.Component {
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
      t, prevStep, addAccount, address,
    } = this.props;

    const title = this.state.title.value || address;
    return <div className={styles.addAccount}>
      <header><h2>{t('How would you call it?')}</h2></header>
      <div>
        <TitleInput
          title={this.state.title}
          onChange={this.handleChange.bind(this)} />
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
            disabled={!!this.state.title.error}
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

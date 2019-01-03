import React from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { Button, TertiaryButton } from '../toolbox/buttons/button';
import { followedAccountAdded } from '../../actions/followedAccounts';
import styles from './followedAccounts.css';
import TitleInput from './accountTitleInput';
import Piwik from '../../utils/piwik';

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
      },
    });
  }

  onCancel() {
    Piwik.trackingEvent('AddAccountTitle', 'button', 'onCancel');
    this.props.prevStep({ reset: true });
  }

  onAddToList() {
    Piwik.trackingEvent('AddAccountTitle', 'button', 'onAddToList');

    const { addAccount, address, prevStep } = this.props;
    const title = this.state.title.value;

    addAccount({ title, address });
    prevStep({ reset: true });
  }

  render() {
    const { t } = this.props;

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
            onClick={() => this.onCancel()}
          />
        </div>
        <div className={grid['col-xs-8']}>
          <TertiaryButton
            label={t('Add to list')}
            disabled={!!this.state.title.error || this.state.title.value === ''}
            className='next'
            onClick={() => this.onAddToList()}
          />
        </div>
      </footer>
    </div>;
  }
}

const mapDispatchToProps = dispatch => ({
  addAccount: data => dispatch(followedAccountAdded(data)),
});

export default connect(null, mapDispatchToProps)(translate()(AddAccountTitle));

import React from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import { getIndexOfFollowedAccount } from '../../utils/followedAccounts';
import SpinnerV2 from '../spinnerV2/spinnerV2';
import svg from '../../utils/svgIcons';
import { FontIcon } from '../fontIcon';
import { InputV2 } from '../toolbox/inputsV2';
import { PrimaryButtonV2, DangerButtonV2 } from '../toolbox/buttons/button';
import styles from './followAccount.css';

class FollowAccount extends React.Component {
  constructor() {
    super();

    this.state = {
      account: {},
      fields: {
        accountName: {
          value: '',
          error: false,
          feedback: '',
          loading: false,
        },
        dashboard: {
          value: true,
        },
      },
      followIndex: -1,
      isValid: false,
    };

    this.timeout = null;

    this.handleAccountNameChange = this.handleAccountNameChange.bind(this);
    this.validateAccountName = this.validateAccountName.bind(this);
    this.handleUnfollow = this.handleUnfollow.bind(this);
    this.handleFollow = this.handleFollow.bind(this);
  }

  /* istanbul ignore next */
  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  componentDidMount() {
    if (this.props.isFollowing) {
      const { accounts, address } = this.props;
      const { fields } = this.state;
      const index = getIndexOfFollowedAccount(accounts, { address });
      this.setState({
        fields: {
          ...fields,
          accountName: {
            ...fields.accountName,
            value: accounts[index].title,
          },
        },
        followIndex: index,
      });
    }
  }

  handleFollow() {
    const { address, balance, accounts } = this.props;
    const title = this.state.fields.accountName.value;
    const account = { address, title, balance };
    const followIndex = accounts.length;
    this.props.addAccount(account);
    this.setState({ account, followIndex });
  }

  handleUnfollow() {
    const { fields, followIndex } = this.state;
    const { accounts } = this.props;
    this.props.removeAccount(accounts[followIndex]);
    this.setState({
      fields: {
        ...fields,
        accountName: {
          ...fields.accountName,
          value: '',
        },
      },
    });
  }

  validateAccountName(value) {
    const { fields } = this.state;
    const accountNameExists = this.props.accounts.filter(acc => acc.title === value).length > 0;
    const accountNameTooLong = !(value.length <= 20);
    const feedback = (accountNameExists && this.props.t('Account name already registered!'))
      || (accountNameTooLong && this.props.t('Account name too long!')) || '';

    this.setState({
      fields: {
        ...fields,
        accountName: {
          ...fields.accountName,
          error: accountNameExists || accountNameTooLong,
          feedback,
          loading: false,
        },
      },
      isValid: (value !== '' && !accountNameExists && !accountNameTooLong),
    });
  }

  handleAccountNameChange({ target }) {
    const { fields } = this.state;
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.validateAccountName(target.value);
    }, 300);

    this.setState({
      fields: {
        ...fields,
        [target.name]: {
          ...fields[target.name],
          value: target.value,
          loading: true,
        },
      },
    });
  }

  render() {
    const { t, isFollowing } = this.props;
    const { isValid, fields } = this.state;

    return (
      <section className={`${styles.wrapper}`}>
        <label className={`${styles.fieldGroup}`}>
          <span className={`${styles.fieldLabel}`}>{t('Account Name')}</span>
          <span className={`${styles.fieldInput}`}>
            <InputV2
              autoComplete={'off'}
              onChange={this.handleAccountNameChange}
              name='accountName'
              value={fields.accountName.value}
              placeholder={t('Account Name')}
              readOnly={isFollowing}
              className={`${styles.input} ${fields.accountName.error ? 'error' : ''}`} />
            {!isFollowing ?
              <React.Fragment>
                <SpinnerV2 className={`${styles.status} ${fields.accountName.loading && fields.accountName.value ? styles.show : ''}`}/>
                <img
                  className={`${styles.status} ${!fields.accountName.loading && fields.accountName.value ? styles.show : ''}`}
                  src={ fields.accountName.error ? svg.alert_icon : svg.ok_icon} />
              </React.Fragment>
            : null}
          </span>
          <span className={`${styles.feedback} ${fields.accountName.error ? 'error' : ''}`}>
            {fields.accountName.feedback}
          </span>
        </label>
        <label className={`${styles.fieldGroup} ${styles.checkboxGroup}`}>
          <input checked={fields.dashboard.value} type='checkbox' readOnly />
          <span className={`${styles.fakeCheckbox}`}>
            <FontIcon className={`${styles.icon}`}>checkmark</FontIcon>
          </span>
          <div className={`${styles.checkboxInfo}`}>
            <span className={`${styles.label}`}>{t('On your dashboard')}</span>
            <span className={`${styles.note}`}>{t('Show this account\'s transactions on the dashboard.')}</span>
          </div>
        </label>
        {isFollowing
          ? <DangerButtonV2 onClick={this.handleUnfollow}>{t('Unfollow')}</DangerButtonV2>
          : <PrimaryButtonV2 onClick={this.handleFollow} disabled={!isValid}>{t('Confirm')}</PrimaryButtonV2>
        }
      </section>
    );
  }
}

FollowAccount.propTypes = {
  address: PropTypes.string.isRequired,
  balance: PropTypes.string.isRequired,
  accounts: PropTypes.arrayOf(PropTypes.object).isRequired,
  isFollowing: PropTypes.bool.isRequired,
  addAccount: PropTypes.func.isRequired,
  removeAccount: PropTypes.func.isRequired,
};

/* istanbul ignore next */
FollowAccount.defaultProps = {
  address: '',
  accounts: [],
  balance: '0',
  isFollowing: false,
  addAccount: () => null,
  removeAccount: () => null,
};

export default translate()(FollowAccount);

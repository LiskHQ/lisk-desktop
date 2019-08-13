import React from 'react';
import debounce from 'lodash.debounce';
import Box from '../../toolbox/box';
import { Input } from '../../toolbox/inputs';
import { PrimaryButton } from '../../toolbox/buttons/button';
import Feedback from '../../toolbox/feedback/feedback';
import Spinner from '../../spinner/spinner';
import Icon from '../../toolbox/icon';
import { fromRawLsk } from '../../../utils/lsk';
import { getAPIClient } from '../../../utils/api/lsk/network';
import regex from '../../../utils/regex';
import links from '../../../constants/externalLinks';
import Fees from '../../../constants/fees';
import styles from './selectName.css';

class SelectName extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      nickname: '',
      error: false,
      inputDisabled: false,
      loading: false,
    };

    this.onChangeNickname = this.onChangeNickname.bind(this);
    this.debounceFetchUser = debounce(this.onUserFetch, 1000);
  }

  componentDidMount() {
    this.getNicknameFromPrevState();
    this.checkIfUserIsDelegate();
    this.hasUserEnoughFunds();
  }

  getNicknameFromPrevState() {
    const { prevState } = this.props;
    if (Object.entries(prevState).length) this.setState({ nickname: prevState.nickname });
  }

  checkIfUserIsDelegate() {
    const { account, t } = this.props;
    if (account && account.delegate) {
      this.setState({
        inputDisabled: true,
        error: t('You have already registered as a delegate.'),
      });
    }
  }

  hasUserEnoughFunds() {
    const { account, t } = this.props;
    const hasFunds = account
      && fromRawLsk(account.balance) * 1 >= fromRawLsk(Fees.registerDelegate) * 1;

    if (!hasFunds) {
      this.setState({
        inputDisabled: true,
        error: t('Insufficient funds (Fee: {{fee}} LSK)', { fee: fromRawLsk(Fees.registerDelegate) }),
      });
    }
  }

  isNameInvalid(nickname) {
    const { t } = this.props;
    if (nickname.length > 20) return t('Nickname is too long.');
    const hasInvalidChars = nickname.replace(regex.delegateSpecialChars, '');
    if (hasInvalidChars) return t(`Invalid character ${hasInvalidChars.trim()}`);
    return false;
  }

  onUserFetch(username, error) {
    const { t, network } = this.props;

    if (!error && username.length) {
      getAPIClient(network).delegates.get({ username })
        .then((response) => {
          if (response.data.length) {
            this.setState({
              loading: false,
              error: t('Name is already taken!'),
            });
          } else {
            this.setState({ loading: false });
          }
        })
        .catch(() => this.setState({ loading: false }));
    }
  }

  onChangeNickname({ target: { value } }) {
    this.setState({ loading: true });
    const error = this.isNameInvalid(value);
    this.setState({ loading: error === false && true });
    this.debounceFetchUser(value, error);
    this.setState({ nickname: value, error: error || '' });
  }

  render() {
    const {
      error,
      inputDisabled,
      loading,
      nickname,
    } = this.state;
    const { t, nextStep } = this.props;

    const isBtnDisabled = !!error || nickname.length === 0 || loading;

    const feedbackInfo = error ? {
      status: 'error',
      className: styles.errorMessage,
    } : {
      status: '',
      className: styles.inputRequirements,
    };

    return (
      <Box width="medium">
        <Box.Header>
          <h1>{t('Become a delegate')}</h1>
        </Box.Header>

        <Box.Content className={`${styles.container} select-name-container`}>
          <p className={`${styles.description} select-name-text-description`}>
            {
              t(`Delegates are the most commited Lisk community members responsible for 
            securing the network and processing all the transactions on Lisk’s blockchain 
            network.`)
            }
          </p>

          <p className={`${styles.description} select-name-text-description`}>
            {
              t('The top 101 delegates are able to forge new blocks and recieve forging rewards.')
            }
          </p>

          <a
            className={`${styles.link} learm-more-link`}
            href={links.votingAndDelegates}
            target="_blank"
            rel="noopener noreferrer"
          >
            {t('Learn more')}
          </a>

          <label className={styles.nicknameLabel}>{t('Your nickname')}</label>

          <div className={styles.inputContainer}>
            <Input
              data-name="delegate-nickname"
              autoComplete="off"
              onChange={this.onChangeNickname}
              name="delegate-nickname"
              value={nickname}
              placeholder={t('ie. peter_pan')}
              className={`${styles.inputNickname} select-name-input`}
              disabled={inputDisabled}
              error={error}
            />
            { /* TODO <Spiner/> and <Icon/> will be incorporated into <Input/> in https://github.com/LiskHQ/lisk-hub/issues/2091 */ }
            <Spinner className={`${styles.spinner} ${loading && nickname.length ? styles.show : styles.hide} spiner`} />
            <Icon
              className={`${styles.status} ${!loading && nickname.length ? styles.show : styles.hide} input-status-icon`}
              name={error ? 'alert_icon' : 'ok_icon'}
            />

            <Feedback
              show
              status={feedbackInfo.status}
              className={`${feedbackInfo.className} input-feedback`}
              showIcon={false}
            >
              {error || t('Max. 20 characters, a-z, 0-1, no special characters except !@$_.')}
            </Feedback>
          </div>
          <Box.Footer>
            <PrimaryButton
              onClick={() => nextStep({ nickname })}
              disabled={isBtnDisabled}
              className={`${styles.confirmBtn} confirm-btn`}
            >
              {t('Go to Confirmation')}
            </PrimaryButton>
          </Box.Footer>
        </Box.Content>
      </Box>
    );
  }
}

export default SelectName;

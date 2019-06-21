import React from 'react';
import debounce from 'lodash.debounce';
import Box from '../../boxV2';
import { InputV2 } from '../../toolbox/inputsV2';
import { PrimaryButtonV2 } from '../../toolbox/buttons/button';
import Feedback from '../../toolbox/feedback/feedback';
import SpinnerV2 from '../../spinnerV2/spinnerV2';
import Icon from '../../toolbox/icon';
import { fromRawLsk } from '../../../utils/lsk';
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
    this.hasUserHasEnoughFunds();
  }

  componentDidUpdate(prevProps) {
    const { delegate, t } = this.props;

    if (prevProps.delegate !== delegate && delegate) {
      if (delegate.delegateNameInvalid) {
        this.setState({ loading: false, error: t('Name is already taken!') });
      } else {
        this.setState({ loading: false });
      }
    }
  }

  getNicknameFromPrevState() {
    const { prevState } = this.props;
    if (Object.entries(prevState).length) this.setState({ nickname: prevState.nickname });
  }

  hasUserHasEnoughFunds() {
    const { account, t } = this.props;
    const hasFunds = account.info &&
      fromRawLsk(account.info.LSK.balance) * 1 >= fromRawLsk(Fees.registerDelegate) * 1;

    if (!hasFunds) {
      this.setState({
        inputDisabled: true,
        error: t('Insufficient funds (Fee: {{fee}} LSK)', { fee: fromRawLsk(Fees.registerDelegate) }),
      });
    }
  }

  checkIfUserIsDelegate() {
    const { account, t } = this.props;
    if (account && account.isDelegate) {
      this.setState({
        inputDisabled: true,
        error: t('This account is a delegate already.'),
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

  onUserFetch(nickname, error) {
    console.log(error, nickname);
    if (!error && nickname.length) {
      this.props.delegatesFetched({ username: nickname });
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
      <Box className={styles.box}>
        <header>
          <h1>{t('Become a delegate')}</h1>
        </header>

        <div className={`${styles.container} select-name-container`}>
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
            target='_blank'
            rel='noopener noreferrer'>
            {t('Learn more')}
          </a>

          <label className={styles.nicknameLabel}>{t('Your nickname')}</label>

          <div className={styles.inputContainer}>
            <InputV2
              data-name={'delegate-nickname'}
              autoComplete={'off'}
              onChange={this.onChangeNickname}
              name='delegate-nickname'
              value={nickname}
              placeholder={t('ie. Peter Pan')}
              className={`${styles.inputNickname} select-name-input`}
              disabled={inputDisabled}
            />
            <SpinnerV2 className={`${styles.spinner} ${loading && nickname.length ? styles.show : styles.hide} spiner`}/>
            <Icon
              className={`${styles.status} ${!loading && nickname.length ? styles.show : styles.hide} input-status-icon`}
              name={error ? 'alert_icon' : 'ok_icon'}
            />

            <Feedback
              show={true}
              status={feedbackInfo.status}
              className={`${feedbackInfo.className} input-feedback`}
              showIcon={false}>
              {error || t('Max. 20 characters, a-z, 0-1, no special characters except !@$_.')}
            </Feedback>
          </div>


          <footer>
            <PrimaryButtonV2
              onClick={() => nextStep({ nickname })}
              disabled={isBtnDisabled}
              className={`${styles.confirmBtn} confirm-btn`}>
              {t('Go to Confirmation')}
            </PrimaryButtonV2>
          </footer>
        </div>
      </Box>
    );
  }
}

export default SelectName;

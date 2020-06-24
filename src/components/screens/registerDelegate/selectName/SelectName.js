import React from 'react';
import Box from '../../../toolbox/box';
import BoxHeader from '../../../toolbox/box/header';
import BoxContent from '../../../toolbox/box/content';
import BoxFooter from '../../../toolbox/box/footer';
import { Input } from '../../../toolbox/inputs';
import { PrimaryButton } from '../../../toolbox/buttons/button';
import { fromRawLsk } from '../../../../utils/lsk';
import { getAPIClient } from '../../../../utils/api/lsk/network';
import regex from '../../../../utils/regex';
import Fees from '../../../../constants/fees';
import Tooltip from '../../../toolbox/tooltip/tooltip';
import styles from './selectName.css';

class SelectName extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      nickname: '',
      error: '',
      inputDisabled: false,
      loading: false,
    };

    this.onChangeNickname = this.onChangeNickname.bind(this);
    this.validateNickname = this.validateNickname.bind(this);
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

  validateNickname(nickname) {
    const { t } = this.props;
    if (nickname.length > 20) return t('Nickname is too long.');
    const hasInvalidChars = nickname.replace(regex.delegateSpecialChars, '');
    if (hasInvalidChars) return t(`Invalid character ${hasInvalidChars.trim()}`);
    return '';
  }

  isNicknameFree(username) {
    clearTimeout(this.timeout);

    this.timeout = setTimeout(() => {
      const { t, network } = this.props;
      getAPIClient(network).delegates.get({ username })
        .then((response) => {
          if (response.data.length) {
            this.setState({
              loading: false,
              error: t('"{{username}}" is already taken.', { username }),
            });
          } else {
            this.setState({ loading: false });
          }
        })
        .catch(() => this.setState({ loading: false }));
    }, 1000);
  }

  onChangeNickname({ target: { value } }) {
    const error = this.validateNickname(value);
    if (value.length && !error) this.isNicknameFree(value);
    this.setState({
      loading: value.length && !error,
      nickname: value,
      error,
    });
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

    return (
      <Box width="medium" className={styles.box}>
        <BoxHeader>
          <h1>{t('Become a delegate')}</h1>
        </BoxHeader>

        <BoxContent className={`${styles.container} select-name-container`}>
          <p className={`${styles.description} select-name-text-description`}>
            {
              t(`Delegates are the most commited Lisk community members responsible for 
            securing the network and processing all the transactions on Lisk’s blockchain 
            network.`)
            }
          </p>

          <p className={`${styles.description} select-name-text-description`}>
            {
              t('The top 101 delegates are able to forge new blocks and receive forging rewards.')
            }
          </p>

          <label className={styles.nicknameLabel}>
            {t('Your nickname')}
            <Tooltip>
              <p>{t('Max. 20 characters, a-z, 0-1, no special characters except !@$_.')}</p>
            </Tooltip>
          </label>

          <div>
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
              isLoading={loading}
              status={error ? 'error' : 'ok'}
              feedback={error}
            />
          </div>
          <BoxFooter>
            <PrimaryButton
              onClick={() => nextStep({ nickname })}
              disabled={isBtnDisabled}
              className={`${styles.confirmBtn} confirm-btn`}
            >
              {t('Go to confirmation')}
            </PrimaryButton>
          </BoxFooter>
        </BoxContent>
      </Box>
    );
  }
}

export default SelectName;

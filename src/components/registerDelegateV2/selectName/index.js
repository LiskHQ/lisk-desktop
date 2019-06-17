import React from 'react';
import Box from '../../boxV2';
import { InputV2 } from '../../toolbox/inputsV2';
import { PrimaryButtonV2 } from '../../toolbox/buttons/button';
import regex from '../../../utils/regex';
import styles from './selectName.css';

class SelectName extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      nickname: '',
      error: null,
    };

    this.onChangeNickname = this.onChangeNickname.bind(this);
  }

  // eslint-disable-next-line class-methods-use-this
  validateName(nickname) {
    return regex.delegateName.test(nickname);
  }

  onChangeNickname({ target: { value } }) {
    const error = this.validateName(value);
    console.log(error);
    this.setState({ nickname: value, error });
  }

  render() {
    const { t } = this.props;
    const { nickname } = this.state;

    return (
      <Box className={styles.box}>
        <header>
          <h1>{t('Become a delegate')}</h1>
        </header>

        <div className={styles.container}>
          <p className={styles.description}>
            {
              t(`Delegates are the most commited Lisk community members responsible for 
            securing the network and processing all the transactions on Lisk’s blockchain 
            network.`)
            }
          </p>

          <p className={styles.description}>
            {
              t('The top 101 delegates are able to forge new blocks and recieve forging rewards.')
            }
          </p>

          <a className={styles.link}>{t('Learn more')}</a>

          <label className={styles.nicknameLabel}>{t('Your nickname')}</label>

          <InputV2
            data-name={'delegate-nickname'}
            autoComplete={'off'}
            onChange={this.onChangeNickname}
            name='delegate-nickname'
            value={nickname}
            placeholder={t('ie. Peter Pan')}
            className={`${styles.inputNickname} search-input`}
          />

          <span className={styles.inputRequirements}>{t('Max. 20 characters, a-z, 0-1, no special characters except !@$_.')}</span>

          <footer>
            <PrimaryButtonV2 className={`${styles.confirmBtn} confirm-btn`}>
              {t('Go to Confirmation')}
            </PrimaryButtonV2>
          </footer>
        </div>
      </Box>
    );
  }
}

export default SelectName;

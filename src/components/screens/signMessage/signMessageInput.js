import React from 'react';
import { AutoResizeTextarea } from '../../toolbox/inputs';
import { PrimaryButton, TertiaryButton } from '../../toolbox/buttons/button';
import { parseSearchParams } from '../../../utils/searchParams';
import Box from '../../toolbox/box';
import BoxContent from '../../toolbox/box/content';
import BoxFooter from '../../toolbox/box/footer';
import BoxHeader from '../../toolbox/box/header';
import BoxInfoText from '../../toolbox/box/infoText';
import Piwik from '../../../utils/piwik';
import styles from './signMessage.css';

class SignMessageInput extends React.Component {
  constructor(props) {
    super(props);

    const { message } = parseSearchParams(props.history.location.search);
    this.state = {
      message: {
        value: message || '',
      },
    };

    this.handleChange = this.handleChange.bind(this);
    this.nextStep = this.nextStep.bind(this);
  }

  handleChange({ target: { name, value } }) {
    this.setState({
      [name]: {
        value,
      },
    });
  }

  nextStep() {
    Piwik.trackingEvent('SignMessageInput', 'button', 'Next step');
    this.props.nextStep({ message: this.state.message.value });
  }

  render() {
    const { t, history } = this.props;
    const { message } = this.state;
    return (
      <Box>
        <BoxHeader>
          <h1>{t('Sign a message')}</h1>
        </BoxHeader>
        <BoxContent>
          <BoxInfoText>{t('You can use your passphrase to sign a message. This signed message can prove that you are the owner of the account, since only your passphrase can produce it. We recommend including date & time or a specific keyword.')}</BoxInfoText>
          <label className={styles.fieldGroup}>
            <span>{t('Message')}</span>
            <AutoResizeTextarea
              className={styles.textarea}
              name="message"
              onChange={this.handleChange}
              value={message.value}
            />
          </label>
        </BoxContent>
        <BoxFooter>
          <PrimaryButton className="next" onClick={this.nextStep}>
            {t('Continue')}
          </PrimaryButton>
          <TertiaryButton onClick={history.goBack}>
            {t('Go back')}
          </TertiaryButton>
        </BoxFooter>
      </Box>
    );
  }
}


export default SignMessageInput;

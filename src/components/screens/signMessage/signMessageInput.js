import React from 'react';
import { AutoResizeTextarea } from '../../toolbox/inputs';
import { PrimaryButton, SecondaryButton } from '../../toolbox/buttons';
import { parseSearchParams } from '../../../utils/searchParams';
import Box from '../../toolbox/box';
import Tooltip from '../../toolbox/tooltip/tooltip';
import BoxContent from '../../toolbox/box/content';
import BoxFooter from '../../toolbox/box/footer';
import BoxHeader from '../../toolbox/box/header';
import BoxInfoText from '../../toolbox/box/infoText';
import Piwik from '../../../utils/piwik';
import styles from './signMessage.css';
import DialogHolder from '../../toolbox/dialog/holder';

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
    const { t } = this.props;
    const { message } = this.state;
    return (
      <Box>
        <BoxHeader>
          <h1>{t('Sign a message')}</h1>
        </BoxHeader>
        <BoxContent className={styles.noPadding}>
          <BoxInfoText>
            <span>{t('The sign message tool allows you to prove ownership of a transaction')}</span>
            <Tooltip className={`${styles.tooltip} showOnBottom`}>
              <p>{t('Recipients will be able to confirm the transfer  by viewing the signature which verifies the ownership without exposing any sensitive account information.')}</p>
            </Tooltip>
          </BoxInfoText>
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
        <BoxFooter direction="horizontal">
          <SecondaryButton onClick={DialogHolder.hideDialog}>
            {t('Close')}
          </SecondaryButton>
          <PrimaryButton className="next" onClick={this.nextStep}>
            {t('Continue')}
          </PrimaryButton>
        </BoxFooter>
      </Box>
    );
  }
}


export default SignMessageInput;
